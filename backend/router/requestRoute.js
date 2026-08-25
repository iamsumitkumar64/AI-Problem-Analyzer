import { Router } from 'express';

import {
    getAllRequest,
    getRequestById,
    uploadRequest,
    updateRequest,
    deleteRequest,
    previewfile,
    generateReport
} from '../controllers/request.js';

const requestRouter = Router();

requestRouter.get('/', getAllRequest);
requestRouter.get('/:req_id', getRequestById);
requestRouter.post('/', uploadRequest);
requestRouter.put('/:req_id', updateRequest);
requestRouter.patch('/:req_id', updateRequest);
requestRouter.delete('/:req_id', deleteRequest);
requestRouter.get('/:req_id/preview', previewfile);
requestRouter.get('/:req_id/report', generateReport);

export default requestRouter;