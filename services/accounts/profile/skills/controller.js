const HttpError = require('../../../../utils/httpError');
const Errors = require('../../../../const/errors');
const dbFunctions = require('./dbFunctions');
const userDbFunctions = require('../../../users/dbFunctions');
const staticVariables = require('../../../../const/staticVariables');

const addSkill = async (req, res, next) => {
    const userId = req.user_id;
    const { skill_ids } = req.body;

    try {
        if (skill_ids.length > staticVariables.MAX_SKILL_PROFILE) {
            return next(new HttpError(Errors.Skill_Is_Max));
        }

        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        let existingProfile = await dbFunctions.getProfileByUserId(userId);

        let profileId;
        if (!existingProfile) {
            existingProfile = await dbFunctions.createProfile(userId);
            profileId = existingProfile.id;
        } else {
            profileId = existingProfile.id;
        }

        const assignedSkills = await dbFunctions.getAllAssignedSkills(profileId);
        const assignedSkillIds = assignedSkills.map((skill) => skill.skill_id);

        for (let skill_id of skill_ids) {
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

        const skillsToRemove = assignedSkillIds.filter((skill_id) => !skill_ids.includes(skill_id));

        for (let skill_id of skillsToRemove) {
            await dbFunctions.deleteAssignedSkill(profileId, skill_id);
        }

        if (existingProfile.status == 'published') {
            await dbFunctions.setProfileStatusPending(profileId);
        }

        res.status(201).json({
            status: 'success'
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const getAllAssignedSkills = async (req, res, next) => {
    const userId = req.user_id;

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        let existingProfile = await dbFunctions.getProfileByUserId(userId);

        const allAssignedSkills = await dbFunctions.getAllAssignedSkills(existingProfile.id);

        res.status(200).json({
            status: 'success',
            result: allAssignedSkills
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const getAllDefinedSkills = async (req, res, next) => {
    const userId = req.user_id;
    const { skill_name } = req.query || {};

    try {
        const existingUser = await userDbFunctions.getUserById(userId);
        if (!existingUser) {
            return next(new HttpError(Errors.User_Undefined));
        }

        const allDefinedSkills = await dbFunctions.getAllDefinedSkills(skill_name);

        res.status(200).json({
            status: 'success',
            result: allDefinedSkills
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};
module.exports = {
    addSkill,
    getAllAssignedSkills,
    getAllDefinedSkills
};
