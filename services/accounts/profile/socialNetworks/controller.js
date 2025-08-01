const HttpError = require('../../../../utils/httpError');
const Errors = require('../../../../const/errors');
const dbFunctions = require('./dbFunctions');
const userDbFunctions = require('../../../users/dbFunctions');

const addSocialNetworks = async (req, res, next) => {
    const userId = req.user_id;
    const socialNetworks = req.body;

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        const existingProfile = await dbFunctions.getProfileByUserId(userId);

        if (!existingProfile) {
            return next(new HttpError(Errors.Profile_Undefined));
        }

        const profileId = existingProfile.id;

        const currentSocialNetworks = await dbFunctions.getAddedSocialNetworks(profileId);

        for (const { name, link } of socialNetworks) {
            const duplicateSocialNetwork = await dbFunctions.getAddedSocialNetwork(profileId, name);
            if (duplicateSocialNetwork) {
                await dbFunctions.updateSocialNetwork(duplicateSocialNetwork.id, name, link);
            } else {
                await dbFunctions.addSocialNetwork(profileId, name, link);
            }
        }

        for (const current of currentSocialNetworks) {
            if (!socialNetworks.some((network) => network.name === current.name)) {
                await dbFunctions.deleteSocialNetwork(current.id);
            }
        }

        if (existingProfile.status === 'accepted') {
            await dbFunctions.setProfileStatusPending(profileId);
        }

        res.status(201).json({
            status: 'success'
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const getAddedSocialNetworks = async (req, res, next) => {
    const userId = req.user_id;

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        const existingProfile = await dbFunctions.getProfileByUserId(userId);

        const allAssignedSkills = await dbFunctions.getAddedSocialNetworks(existingProfile.id);

        res.status(200).json({
            status: 'success',
            result: allAssignedSkills
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const deleteSocialNetworkById = async (req, res, next) => {
    const userId = req.user_id;
    const social_network_id = req.params.social_network_id;

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        const existingProfile = await dbFunctions.getProfileByUserId(userId);
        if (!existingProfile) {
            return next(new HttpError(Errors.Profile_Undefined));
        }

        const socialNetworkToDelete = await dbFunctions.getSocialNetworkByIdAndProfileId(
            social_network_id,
            existingProfile.id
        );
        if (!socialNetworkToDelete) {
            return next(new HttpError(Errors.SocialNetwork_Not_Found));
        }

        await dbFunctions.deleteSocialNetwork(social_network_id);

        const remainingSocialNetworks = await dbFunctions.getAddedSocialNetworks(
            existingProfile.id
        );

        res.status(200).json({
            status: 'success',
            result: remainingSocialNetworks
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

module.exports = {
    addSocialNetworks,
    getAddedSocialNetworks,
    deleteSocialNetworkById
};
