import { Router } from 'express';

import {
    reportdata,
    Onereportdata
} from '../controllers/report.js';

const reportRouter = Router();

reportRouter.get('/:req_id', reportdata);
reportRouter.get('/Onereport/:req_id', Onereportdata);

export default reportRouter;