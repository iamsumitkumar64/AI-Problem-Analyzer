import reportDB from '../models/Report.js';

export const reportdata = async (req, res) => {
    const data = await reportDB.findOne(
        { requestId: req.params.req_id },
        { reportData: 1, _id: 0 }
    );
    return res.status(200).json({ message: 'Works Fine', data });
};

export const Onereportdata = async (req, res) => {
    const data = await reportDB.findOne(
        { 'reportData._id': req.params.req_id },
        { reportData: { $elemMatch: { _id: req.params.req_id } }, _id: 0 }
    );
    return res.status(200).json({ message: 'Works Fine', data });
};