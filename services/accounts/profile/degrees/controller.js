const HttpError = require('../../../../utils/httpError');
const Errors = require('../../../../const/errors');
const dbFunctions = require('./dbFunctions');
const userDbFunctions = require('../../../users/dbFunctions');

const addDegree = async (req, res, next) => {
    const userId = req.user_id;

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        const existingProfile = await dbFunctions.getProfileByUserId(userId);

        let profileId;
        if (!existingProfile) {
            const newProfile = await dbFunctions.createProfile(userId);
            profileId = newProfile.id;
        } else {
            profileId = existingProfile.id;
        }

        const addDegreeData = {
            profile_id: profileId,
            ...req.body
        };

        const newDegree = await dbFunctions.addDegree({
            ...addDegreeData
        });

        if (existingProfile.status == 'accepted') {
            await dbFunctions.setProfileStatusPending(profileId);
        }

        res.status(201).json({
            status: 'success',
            result: newDegree
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const getAllDegrees = async (req, res, next) => {
    const userId = req.user_id;

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        const existingProfile = await dbFunctions.getProfileByUserId(userId);

        const allDegrees = await dbFunctions.getAllDegrees(existingProfile.id);

        res.status(200).json({
            status: 'success',
            result: allDegrees
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const getDegreeById = async (req, res, next) => {
    const degree_id = req.params.degree_id;

    try {
        const foundedDegree = await dbFunctions.getDegreeById(degree_id);
        if (!foundedDegree) {
            return next(new HttpError(Errors.Degree_Undefined));
        }

        res.status(200).json({
            status: 'success',
            result: foundedDegree
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const updateDegreeById = async (req, res, next) => {
    const degree_id = req.params.degree_id;
    const userId = req.user_id;

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        const updatedDegree = await dbFunctions.updateDegreeById(degree_id, req.body);

        const existingProfile = await dbFunctions.getProfileByUserId(userId);
        if (existingProfile.status == 'accepted') {
            await dbFunctions.setProfileStatusPending(profileId);
        }

        res.status(200).json({
            status: 'success',
            result: updatedDegree
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const deleteDegreeById = async (req, res, next) => {
    const degree_id = req.params.degree_id;
    const userId = req.user_id;

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        const foundedDegree = await dbFunctions.getDegreeById(degree_id);
        if (!foundedDegree) {
            return next(new HttpError(Errors.Degree_Undefined));
        }

        const updatedDegree = await dbFunctions.deleteDegreeById(degree_id);

        const existingProfile = await dbFunctions.getProfileByUserId(userId);
        if (existingProfile.status == 'accepted') {
            await dbFunctions.setProfileStatusPending(profileId);
        }

        res.status(200).json({
            status: 'success',
            result: updatedDegree
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

module.exports = {
    addDegree,
    getAllDegrees,
    getDegreeById,
    updateDegreeById,
    deleteDegreeById
};
