const HttpError = require('../../../../utils/httpError');
const Errors = require('../../../../const/errors');
const dbFunctions = require('./dbFunctions');

// Get All Banners
const getAllBanners = async (req, res, next) => {
    try {
        const allBanners = await dbFunctions.getAllBanners();

        res.status(200).json({
            status: 'success',
            result: allBanners
        });
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    getAllBanners
};
