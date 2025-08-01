const HttpError = require('../../../../utils/httpError');
const Errors = require('../../../../const/errors');
const dbFunctions = require('./dbFunctions');

const getStatistics = async (req, res, next) => {
    try {
        const allStatistics = await dbFunctions.getStatistics();

        res.status(200).json({
            status: 'success',
            result: allStatistics
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    getStatistics
};
