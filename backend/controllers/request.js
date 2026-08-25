import requestDB from '../models/request.js';
import multer_config from '../config/multer.js';
import { delfile } from '../config/delete_file.js';
import mongoose from 'mongoose';
import reportDB from '../models/Report.js';
import { reportGenerationQueue } from '../config/bullmq.js';

const file_type = ['application/pdf', '.pdf'];

// Helper to construct query matching request by custom id or _id and ensuring owner isolation or shared example
const buildRequestFilter = (req_id, creatorId) => {
    const idFilter = mongoose.Types.ObjectId.isValid(req_id)
        ? { $or: [{ id: new mongoose.Types.ObjectId(req_id) }, { _id: new mongoose.Types.ObjectId(req_id) }] }
        : { id: req_id };

    const creatorFilter = mongoose.Types.ObjectId.isValid(creatorId)
        ? { $or: [{ createdBy: new mongoose.Types.ObjectId(creatorId) }, { createdBy: creatorId }, { createdBy: null }] }
        : { $or: [{ createdBy: creatorId }, { createdBy: null }] };

    return { $and: [idFilter, creatorFilter] };
};

// GET /requests - Retrieve a list of all requests (200 OK)
export const getAllRequest = async (req, res) => {
    try {
        const creatorId = req.session?.user?.id;
        const creatorFilter = mongoose.Types.ObjectId.isValid(creatorId)
            ? { $or: [{ createdBy: new mongoose.Types.ObjectId(creatorId) }, { createdBy: creatorId }, { createdBy: null }] }
            : { $or: [{ createdBy: creatorId }, { createdBy: null }] };

        const ans = await requestDB.find(
            creatorFilter,
            { updatedAt: 0 }
        );
        const formattedRequests = ans.map((item) => {
            const reqObj = item.toObject ? item.toObject() : item;
            return {
                ...reqObj,
                id: (reqObj.id || reqObj._id).toString()
            };
        });
        return res.status(200).json({ message: 'Connection Established For Requests', data: formattedRequests });
    } catch (err) {
        console.error('getAllRequest error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /requests/:req_id - Retrieve a specific request by ID (200 OK)
export const getRequestById = async (req, res) => {
    const req_id = req.params.req_id;
    const creatorId = req.session?.user?.id;
    if (!req_id) {
        return res.status(400).json({ error: 'Request ID is required' });
    }
    try {
        const filter = buildRequestFilter(req_id, creatorId);
        const request = await requestDB.findOne(filter);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const reqObj = request.toObject ? request.toObject() : request;
        return res.status(200).json({
            message: 'Request details',
            data: {
                ...reqObj,
                id: (reqObj.id || reqObj._id).toString()
            }
        });
    } catch (err) {
        console.error('getRequestById error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /requests/:req_id/preview - Preview request file (200 OK)
export const previewfile = async (req, res) => {
    const req_id = req.params.req_id;
    if (!req_id) {
        return res.status(400).json({ error: 'Request ID is required' });
    }
    try {
        const idFilter = mongoose.Types.ObjectId.isValid(req_id)
            ? { $or: [{ id: new mongoose.Types.ObjectId(req_id) }, { _id: new mongoose.Types.ObjectId(req_id) }] }
            : { id: req_id };
        const ans = await requestDB.findOne(idFilter, { file_name: 1, _id: 0 });
        if (!ans || !ans.file_name) {
            return res.status(404).json({ message: 'Preview file not found' });
        }
        const file_address = `${process.env.BACKEND_URL}/upload/${ans.file_name}`;
        return res.status(200).json({ message: 'Preview Request', file_address });
    } catch (err) {
        console.error('previewfile error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /requests - Create new request (201 Created)
export const uploadRequest = async (req, res) => {
    multer_config(file_type).single('pdffile')(req, res, async (error) => {
        if (error) {
            console.error('Multer upload error:', error);
            if (req.file?.filename) delfile(req.file.filename);
            return res.status(400).json({ message: error.message || 'File upload error' });
        }
        if (!req.file || !req.file.filename) {
            return res.status(400).json({ message: 'File Not Supported or Missing' });
        }
        try {
            const creatorId = req.session?.user?.id;
            const newId = new mongoose.Types.ObjectId();
            const newReq = await requestDB.create({
                id: newId,
                title: req.body.title || 'Untitled Request',
                description: req.body.description || '',
                file_name: req.file.filename,
                createdBy: mongoose.Types.ObjectId.isValid(creatorId)
                    ? new mongoose.Types.ObjectId(creatorId)
                    : creatorId
            });
            return res.status(201).json({
                message: 'Uploaded Success',
                data: {
                    id: (newReq.id || newReq._id).toString(),
                    title: newReq.title,
                    description: newReq.description,
                    file_name: newReq.file_name,
                    createdAt: newReq.createdAt
                }
            });
        } catch (err) {
            console.error('UploadRequest Function error:', err);
            if (req.file?.filename) delfile(req.file.filename);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
};

// PUT /requests/:req_id & PATCH /requests/:req_id - Update request (200 OK)
export const updateRequest = async (req, res) => {
    const req_id = req.params.req_id;
    const { title, description } = req.body;
    const creatorId = req.session?.user?.id;
    if (!req_id) {
        return res.status(400).json({ error: 'Request ID is required' });
    }
    try {
        const filter = buildRequestFilter(req_id, creatorId);
        const updated = await requestDB.findOneAndUpdate(
            filter,
            { $set: { ...(title !== undefined && { title }), ...(description !== undefined && { description }) } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Request not found' });
        }

        return res.status(200).json({
            message: 'Request updated',
            data: {
                ...updated.toObject(),
                id: (updated.id || updated._id).toString()
            }
        });
    } catch (err) {
        console.error('updateRequest error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// DELETE /requests/:req_id - Delete a specific request permanently (204 No Content)
export const deleteRequest = async (req, res) => {
    const req_id = req.params.req_id;
    const creatorId = req.session?.user?.id;
    if (!req_id) {
        return res.status(400).json({ error: 'Request ID is required' });
    }
    try {
        const filter = buildRequestFilter(req_id, creatorId);
        const ans = await requestDB.findOneAndDelete(filter);

        if (!ans) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const reportFilter = mongoose.Types.ObjectId.isValid(req_id)
            ? { $or: [{ requestId: new mongoose.Types.ObjectId(req_id) }, { requestId: req_id }] }
            : { requestId: req_id };
        await reportDB.deleteMany(reportFilter);

        if (ans.file_name) {
            delfile(ans.file_name);
        }
        return res.status(204).send();
    } catch (err) {
        console.error('deleteRequest error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /requests/:req_id/report - Generate / fetch AI report for request (200 OK)
export const generateReport = async (req, res) => {
    const req_id = req.params.req_id;
    if (!req_id) {
        return res.status(400).json({ error: 'Request ID is required' });
    }
    try {
        const reportFilter = mongoose.Types.ObjectId.isValid(req_id)
            ? { $or: [{ requestId: new mongoose.Types.ObjectId(req_id) }, { requestId: req_id }] }
            : { requestId: req_id };

        let isExists = await reportDB.findOne(reportFilter);
        if (isExists) {
            return res.status(200).json({ message: 'Report Request', reports: isExists.reportData });
        }

        await reportGenerationQueue.add(
            'reportGenerationQueue',
            { req_id, isExists, username: req.session?.user?.username || 'user' },
            {
                attempts: 5,
                backoff: { type: 'exponential', delay: 10000 },
                removeOnComplete: true,
                removeOnFail: false
            }
        );
        return res.status(200).json({ message: 'Report Request - Processing Started' });
    } catch (err) {
        const idFilter = mongoose.Types.ObjectId.isValid(req_id)
            ? { $or: [{ id: new mongoose.Types.ObjectId(req_id) }, { _id: new mongoose.Types.ObjectId(req_id) }] }
            : { id: req_id };
        await requestDB.findOneAndUpdate(idFilter, { status: 'Failed' });
        console.error('generateReport error:', err);
        return res.status(503).json({ message: 'AI Service Unavailable Today' });
    }
};