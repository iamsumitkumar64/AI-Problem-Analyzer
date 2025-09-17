import { Router } from 'express';

import {
    getAllRequest,
    uploadRequest,
    deleteRequest,
    previewfile,
    generateReport
} from '../controllers/request.js';

const requestRouter = Router();

requestRouter.get('/', getAllRequest);
requestRouter.get('/preview/:req_id', previewfile);
requestRouter.get('/report/:req_id', generateReport);
requestRouter.post('/', uploadRequest);
requestRouter.delete('/:req_id', deleteRequest);

export default requestRouter;