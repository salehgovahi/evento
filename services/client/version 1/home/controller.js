const HttpError = require('../../../../utils/httpError');
const Errors = require('../../../../const/errors');
const dbFunctions = require('./dbFunctions');

// Get All Courses Sorted by Rate
const getCourses = async (req, res, next) => {
    try {
        const allCourses = await dbFunctions.getAllCourses();

        res.status(200).json({
            status: 'success',
            result: allCourses
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

// Get All Roadmaps
const getRoadmaps = async (req, res, next) => {
    try {
        const allRoadmaps = await dbFunctions.getAllRoadmaps();

        res.status(200).json({
            status: 'success',
            result: allRoadmaps
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

// Get All BootCamps
const getBootCamps = async (req, res, next) => {
    try {
        const allBootCamps = await dbFunctions.getAllBootCamps(req.query);

        res.status(200).json({
            status: 'success',
            result: allBootCamps
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    getCourses,
    getRoadmaps,
    getBootCamps
};
