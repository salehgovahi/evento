const HttpError = require('../../../../utils/httpError');
const Errors = require('../../../../const/errors');
const dbFunctions = require('./dbFunctions');
const userDbFunctions = require('../../../users/dbFunctions');
const staticVariables = require('../../../../const/staticVariables');

const getPendingProfilesToPublish = async (req, res, next) => {
    try {
        const pendingPublishes = await dbFunctions.getPendingProfilesToPublish();

        res.status(200).json({
            status: 'success',
            result: pendingPublishes
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const requestPublishProfile = async (req, res, next) => {
    const userId = req.user_id;

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        const existingProfile = await dbFunctions.getProfileByUserId(userId);
        if (!existingProfile) {
            return next(new HttpError(Errors.Profile_Undefined));
        }

        let updatedProfile;
        if (existingProfile.status == 'published') {
            updatedProfile = await dbFunctions.requestPrivateProfile(existingProfile.id);
        }
        if (existingProfile.status == 'private') {
            updatedProfile = await dbFunctions.requestPublishProfile(existingProfile.id);
        }

        res.status(200).json({
            status: 'success',
            result: updatedProfile
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const modifyProfileStatus = async (req, res, next) => {
    const { status, profile_id } = req.body;

    try {
        const existingProfile = await dbFunctions.getProfileById(profile_id);
        if (!existingProfile) {
            return next(new HttpError(Errors.Profile_Undefined));
        }

        const updatedProfile = await dbFunctions.modifyProfileStatus(profile_id, status);

        res.status(200).json({
            status: 'success',
            result: updatedProfile
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

module.exports = {
    getPendingProfilesToPublish,
    requestPublishProfile,
    modifyProfileStatus
};
