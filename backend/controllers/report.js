import mongoose from 'mongoose';
import reportDB from '../models/Report.js';

// GET /reports - Retrieve all reports (200 OK)
export const getAllReports = async (req, res) => {
    try {
        const reports = await reportDB.find({}, { __v: 0 });
        return res.status(200).json({ message: 'All reports', data: reports });
    } catch (err) {
        console.error('getAllReports error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /reports/:req_id - Retrieve report data by request ID (200 OK)
export const getReportByRequestId = async (req, res) => {
    const req_id = req.params.req_id;
    if (!req_id) {
        return res.status(400).json({ error: 'Request ID is required' });
    }
    try {
        const filter = mongoose.Types.ObjectId.isValid(req_id)
            ? { $or: [{ requestId: new mongoose.Types.ObjectId(req_id) }, { requestId: req_id }] }
            : { requestId: req_id };

        const data = await reportDB.findOne(filter, { reportData: 1, _id: 0 });
        if (!data) {
            return res.status(404).json({ message: 'Report not found', data: { reportData: [] } });
        }
        return res.status(200).json({ message: 'Report details', data });
    } catch (err) {
        console.error('getReportByRequestId error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /reports/items/:item_id or /reports/:req_id/items/:item_id - Retrieve single problem report item (200 OK)
export const getReportItemById = async (req, res) => {
    const item_id = req.params.item_id || req.params.req_id;
    if (!item_id) {
        return res.status(400).json({ error: 'Report item ID is required' });
    }
    try {
        const itemObjId = mongoose.Types.ObjectId.isValid(item_id)
            ? new mongoose.Types.ObjectId(item_id)
            : item_id;

        const data = await reportDB.findOne(
            { 'reportData._id': itemObjId },
            { reportData: { $elemMatch: { _id: itemObjId } }, _id: 0 }
        );
        if (!data || !data.reportData || data.reportData.length === 0) {
            return res.status(404).json({ message: 'Report item not found' });
        }
        return res.status(200).json({ message: 'Report item details', data });
    } catch (err) {
        console.error('getReportItemById error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// DELETE /reports/:req_id - Delete report by request ID (204 No Content)
export const deleteReport = async (req, res) => {
    const req_id = req.params.req_id;
    if (!req_id) {
        return res.status(400).json({ error: 'Request ID is required' });
    }
    try {
        const filter = mongoose.Types.ObjectId.isValid(req_id)
            ? { $or: [{ requestId: new mongoose.Types.ObjectId(req_id) }, { requestId: req_id }] }
            : { requestId: req_id };

        await reportDB.findOneAndDelete(filter);
        return res.status(204).send();
    } catch (err) {
        console.error('deleteReport error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};