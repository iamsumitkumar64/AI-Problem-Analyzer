import requestDB from '../models/request.js';
import multer_config from '../config/multer.js';
import { delfile } from '../config/delete_file.js';
import { __dirname } from '../index.js';
import mongoose from 'mongoose';
import { pdfConvertFunc } from '../config/generation.js';
import reportDB from '../models/Report.js';

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
        await requestDB.findOneAndUpdate(
            { id: req_id },
            { status: 'Pending' }
        );
        const ans = await requestDB.findOne({ id: req_id }, { file_name: 1, _id: 0 });
        const file_address = `/uploads/${ans.file_name}`;
        let reports = await pdfConvertFunc(file_address, 'image', req.session.user.username + `${ans.file_name}`);
        reports = reports.map(r => {
            let cleaned = r.raw.trim()
                .replace(/^```json\n?/i, '')
                .replace(/^```/, '')
                .replace(/```$/, '')
                .trim();
            // Only attempt parsing if it starts like JSON
            if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
                return JSON.parse(cleaned);
            } else {
                console.warn('Skipped non-JSON content:', cleaned.slice(0, 100)); // Show a sample
                return null;
            }
        }).filter(r => r !== null); // remove any entries that failed parsing

        const wrappedReport = {
            requestId: new mongoose.Types.ObjectId(req_id),
            reportData: reports.flat() // .flat() in case of nested arrays
        };
        let report = await reportDB.findOneAndUpdate(
            { requestId: req_id },
            wrappedReport,
            { new: true, upsert: true }
        );
        await requestDB.findOneAndUpdate(
            { id: req_id },
            { documents: report.reportData.length, status: 'Complete' }
        );
        return res.status(200).json({ 'message': 'Report Request', reports });
    } catch (err) {
        await requestDB.findOneAndUpdate(
            { id: req_id },
            { status: 'Failed' }
        );
        return res.status(503).json({ 'message': 'AI Service Unavilable Today'});
    }
}