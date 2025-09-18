import {Queue,Worker} from 'bullmq';
import ioredis from 'ioredis';
import {getIo} from './socket.js';
import requestDB from '../models/request.js';
import reportDB from '../models/Report.js';
import mongoose from 'mongoose';
import { pdfConvertFunc } from './generation.js';

const connection= new ioredis({
    host:'127.0.0.1',
    port:6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

export const reportGenerationQueue=new Queue('reportGenerationQueue',{connection});

const fileWorker=new Worker(
    'reportGenerationQueue',
    async job=>{
        try{
           const { 
            req_id, 
            username
        } = job.data;
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
        getIo().emit('report','success',report);
    }
    catch(error){
        getIo().emit('report','Worker Failed');
        console.log(error);
        console.error('❌ Worker Error:', error.message);
        throw error;
    }},
    {connection}
);