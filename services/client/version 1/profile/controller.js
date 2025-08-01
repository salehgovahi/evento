const HttpError = require('../../../../utils/httpError');
const Errors = require('../../../../const/errors');
const dbFunctions = require('./dbFunctions');

// Get Profile
const getProfile = async (req, res, next) => {
    const profile_id = req.params.profile_id;
    const isAdmin = req.isAdmin;
    const user_id = req.user_id;

    try {
        const foundedProfile = await dbFunctions.getProfile(profile_id);
        if (user_id == foundedProfile.user_id || isAdmin) {
            res.status(200).json({
                status: 'success',
                result: foundedProfile
            });
        } else {
            if (foundedProfile.status != 'published') {
                const error = new HttpError(Errors.Profile_Undefined);
                return next(error);
            }
            res.status(200).json({
                status: 'success',
                result: foundedProfile
            });
        }
    } catch (err) {
        console.log(err);
        const error = new HttpError(Errors.Something_Went_Wrong);
        return next(error);
    }
};

module.exports = {
    getProfile
};
