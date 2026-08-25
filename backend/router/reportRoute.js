import { Router } from 'express';

import {
    getAllReports,
    getReportByRequestId,
    getReportItemById,
    deleteReport
} from '../controllers/report.js';

const reportRouter = Router();

reportRouter.get('/', getAllReports);
reportRouter.get('/:req_id', getReportByRequestId);
reportRouter.get('/:req_id/items/:item_id', getReportItemById);
reportRouter.delete('/:req_id', deleteReport);

export default reportRouter;