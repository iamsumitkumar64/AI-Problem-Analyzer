import requestDB from '../models/request.js';
import multer_config from '../config/multer.js';
import { delfile } from '../config/delete_file.js';
import { __dirname } from '../index.js';
import mongoose from 'mongoose';
import reportDB from '../models/Report.js';
import {reportGenerationQueue} from '../config/bullmq.js';

const file_type = ['application/pdf', '.pdf'];

export const getAllRequest = async (req, res) => {
    let ans = await requestDB.find(
        { createdBy: req.session.user.id },
        { _id: 0, updatedAt: 0, createdBy: 0 }
    );
    return res.status(200).json({ 'message': 'Connection Establised For Requests', data: ans });
};

export const previewfile = async (req, res) => {
    const req_id = req.params.req_id;
    const ans = await requestDB.findOne({ id: req_id }, { file_name: 1, _id: 0 });
    const file_address = `${process.env.BACKEND_URL}/upload/${ans.file_name}`;
    return res.status(200).json({ 'message': 'Preview Request', file_address });
}

export const deleteRequest = async (req, res) => {
    const req_id = req.params.req_id;
    const ans = await requestDB.findOneAndDelete({ id: req_id }, { file_name: 1, _id: 0 });
    await reportDB.findOneAndDelete({ requestId: new mongoose.Types.ObjectId(req_id) });
    delfile(ans.file_name);
    return res.status(200).json({ 'message': 'Delete Request' });
};

export const uploadRequest = async (req, res) => {
    multer_config(file_type).single('pdffile')(req, res, async (error) => {
        if (!req.file || !req.file.filename) {
            return res.status(404).json({ 'message': 'File Not Supported' });
        }
        if (error) {
            console.log(error);
            delfile(req.file.filename);
            return;
        }
        try {
            await requestDB.create(
                {
                    title: req.body.title,
                    description: req.body.description,
                    file_name: req.file.filename,
                    createdBy: new mongoose.Types.ObjectId(req.session.user.id)
                }
            );
            return res.status(200).json({ 'message': 'Uploaded Success' });
        } catch (err) {
            console.log(`UploadRequest Function :${err}`);
            delfile(req.file.filename);
        }
    })
};

export const generateReport = async (req, res) => {
    const req_id = req.params.req_id;
    let isExists = await reportDB.findOne(
        { requestId: req_id }
    );
    if (isExists) {
        return res.status(200).json({ 'message': 'Report Request', reports: isExists.reportData });
    }
    try {
       await reportGenerationQueue.add(
            'reportGenerationQueue',
            {req_id,isExists, username: req.session.user.username }   , {
    attempts: 5, 
    backoff: { type: 'exponential', delay: 10000 },
    removeOnComplete: true,
    removeOnFail: false
  }
        );
        return res.status(200).json({ 'message': 'Report Request - Processing Started' });
    } catch (err) {
        await requestDB.findOneAndUpdate(
            { id: req_id },
            { status: 'Failed' }
        );
        console.log(err);
        return res.status(503).json({ 'message': 'AI Service Unavilable Today'});
    }
}