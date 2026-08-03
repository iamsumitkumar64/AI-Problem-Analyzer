import { Queue, Worker } from 'bullmq';
import ioredis from 'ioredis';
import { getIo } from './socket.js';
import requestDB from '../models/request.js';
import reportDB from '../models/Report.js';
import mongoose from 'mongoose';
import { pdfConvertFunc } from './generation.js';

const connection = new ioredis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

export const reportGenerationQueue = new Queue('reportGenerationQueue', { connection });

const fileWorker = new Worker(
    'reportGenerationQueue',
    async job => {
        try {
            const { req_id, username } = job.data;
            await requestDB.findOneAndUpdate(
                { id: req_id },
                { status: 'Pending' }
            );
            const ans = await requestDB.findOne({ id: req_id }, { file_name: 1, _id: 0 });
            const file_address = `/uploads/${ans.file_name}`;
            let reports = await pdfConvertFunc(
                file_address,
                'image',
                `${username}_${ans.file_name}`
            );

            reports = reports.map(r => {
                if (!r) return null;
                // If r is already a parsed object without a 'raw' property, return it as is
                if (typeof r === 'object' && !('raw' in r)) {
                    return r;
                }
                const textToParse = typeof r === 'string' ? r : (r.raw || '');
                if (typeof textToParse !== 'string' || !textToParse) return null;

                let cleaned = textToParse.trim()
                    .replace(/^```json\n?/i, '')
                    .replace(/^```/, '')
                    .replace(/```$/, '')
                    .trim();

                if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
                    try {
                        return JSON.parse(cleaned);
                    } catch (parseErr) {
                        console.warn('Failed to parse JSON string:', parseErr.message);
                        return null;
                    }
                } else {
                    console.warn('Skipped non-JSON content:', cleaned.slice(0, 100));
                    return null;
                }
            }).filter(Boolean);

            const wrappedReport = {
                requestId: new mongoose.Types.ObjectId(req_id),
                reportData: reports.flat()
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
            getIo().emit('report', 'success', report);
        }
        catch (error) {
            getIo().emit('report', 'Worker Failed');
            console.error('❌ Worker Error:', error.message);
            throw error;
        }
    },
    { connection }
);