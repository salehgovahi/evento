const HttpError = require('../../../../utils/httpError');
const Errors = require('../../../../const/errors');
const dbFunctions = require('./dbFunctions');
const userDbFunctions = require('../../../users/dbFunctions');
const staticVariables = require('../../../../const/staticVariables');
const { sendRequest } = require('../../../../utils/sendRequest');
const environments = require('../../../../configs/environments');

const createProfile = async (req, res, next) => {
    const userId = req.user_id;

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        let existingProfile = await dbFunctions.getProfileByUserId(userId);

        let result;
        if (!existingProfile) {
            result = await dbFunctions.createProfile(userId);
        } else {
            result = existingProfile;
        }

        res.status(201).json({
            status: 'success',
            result: result
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const updateImageProfile = async (req, res, next) => {
    const userId = req.user_id;
    const image = req.file;
    let { skill_ids, title, socials } = req.body; 

    try {        
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        if (image) {
            const sendFileToFileServer = await sendRequest(
                environments.FILE_SERVER_SEND_IMAGE_URL,
                image.path
            );
            await dbFunctions.updateProfileImage(userId, sendFileToFileServer.image_url);    
        }
        
        let existingProfile = await dbFunctions.getProfileByUserId(userId);
        let profileId;
        if (!existingProfile) {
            const newProfile = await dbFunctions.createProfile(userId);
            profileId = newProfile.id;
        } else {
            profileId = existingProfile.id;
        }

        if (skill_ids) {
            const assignedSkills = await dbFunctions.getAllAssignedSkills(profileId);
            const assignedSkillIds = assignedSkills.map((skill) => skill.skill_id);

            const numericSkillIds = skill_ids.map((id) => parseInt(id, 10));

            for (let skill_id of numericSkillIds) {
                const existingSkill = await dbFunctions.getSkillById(skill_id);
                if (!existingSkill) {
                    return next(new HttpError(Errors.Skill_Undefined));
                } else {
                    const duplicateSkill = assignedSkillIds.includes(skill_id);
                    if (!duplicateSkill) {
                        await dbFunctions.addSkill(profileId, skill_id);
                    }
                }
            }

            const skillsToRemove = assignedSkillIds.filter(
                (skill_id) => !numericSkillIds.includes(skill_id)
            );

            for (let skill_id of skillsToRemove) {
                await dbFunctions.deleteAssignedSkill(profileId, skill_id);
            }
        }

        if (title) {
            await dbFunctions.updateTitle(userId, title);
        }

        if (socials) {            
            await dbFunctions.deleteAllProfileSocialNetworks(profileId);

            for (let social of socials) {
                social = JSON.parse(social)

                if (social.name && social.link) {
                    await dbFunctions.addSocialNetwork(profileId, social.name, social.link);
                }
            }
        }

        const updatedProfile = await dbFunctions.getProfileByProfileId(existingProfile.id);

        res.status(200).json({
            status: 'success',
            result: updatedProfile
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const updateAboutMe = async (req, res, next) => {
    const userId = req.user_id;
    const { about } = req.body;

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        const updatedAbout = await dbFunctions.updateAboutMe(userId, about);

        res.status(200).json({
            status: 'success',
            result: updatedAbout
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const updateTitle = async (req, res, next) => {
    const userId = req.user_id;
    const { title } = req.body;

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        const updatedAbout = await dbFunctions.updateTitle(userId, title);

        res.status(200).json({
            status: 'success',
            result: updatedAbout
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

module.exports = {
    createProfile,
    updateImageProfile,
    updateAboutMe,
    updateTitle
};
