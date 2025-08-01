const HttpError = require('../../../../utils/httpError');
const Errors = require('../../../../const/errors');
const dbFunctions = require('./dbFunctions');

const getAllNotifications = async (req, res, next) => {
    const user_id = req.user_id;
    const read = req.query.read;

    try {
        const allNotifications = await dbFunctions.getAllNotifications(user_id, filter);

        res.status(200).json({
            status: 'success',
            result: myCourse
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getMyCertificates = async (req, res, next) => {
    const user_id = req.user_id;

    try {
        const myCertificates = await dbFunctions.getMyCertificates(user_id);

        res.status(200).json({
            status: 'success',
            result: myCertificates
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getMyQuestions = async (req, res, next) => {
    const user_id = req.user_id;

    try {
        const myQuestions = await dbFunctions.getMyQuestions(user_id);

        res.status(200).json({
            status: 'success',
            result: myQuestions
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

const getMyBootCamps = async (req, res, next) => {
    const user_id = req.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const getAllBootCamps = await dbFunctions.getMyBootCamps(user_id, page, limit);
        res.status(200).json({
            status: 'success',
            result: getAllBootCamps
        });
    } catch (err) {
        console.error(err.message);
        return next(new HttpError(Errors.Something_Went_Wrong));
    }
};

module.exports = {
    getAllNotifications,
    getMyCertificates,
    getMyQuestions,
    getMyBootCamps
};
