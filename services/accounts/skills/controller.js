const HttpError = require('../../../utils/httpError');
const Errors = require('../../../const/errors');
const dbFunctions = require('./dbFunctions');

// Add a skill
const addSkill = async (req, res, next) => {
    const { name } = req.body;

    try {
        let result;
        const existingSkill = await dbFunctions.getSkillByName(name);
        
        if (existingSkill) {
            result = existingSkill;
        } else {
            result = await dbFunctions.addSkill(name);
        }

        res.status(201).json({
            status: 'success',
            result: result
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

// Get all contents
const getAllSkills = async (req, res, next) => {
    try {
        const foundedSkills = await dbFunctions.getAllSkills();

        res.status(200).json({
            status: 'success',
            result: foundedSkills
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

const updateSkillById = async (req, res, next) => {
    const skill_id = req.params.skill_id;
    const { name } = req.body;

    try {
        const existingSkill = await dbFunctions.getSkillById(parseInt(skill_id));
        if (!existingSkill) {
            return next(new HttpError(Errors.Skill_Undefined));
        }

        const deletedSkill = await dbFunctions.updateSkillById(parseInt(skill_id), name);

        res.status(200).json({
            status: 'success',
            result: deletedSkill
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong));
    }
};

const deleteSkillById = async (req, res, next) => {
    const skill_id = req.params.skill_id;
    try {
        const existingSkill = await dbFunctions.getSkillById(parseInt(skill_id));
        if (!existingSkill) {
            return next(new HttpError(Errors.Skill_Undefined));
        }

        const deletedSkill = await dbFunctions.deleteSkillById(parseInt(skill_id));

        res.status(200).json({
            status: 'success',
            result: deletedSkill
        });
    } catch (err) {
        return next(new HttpError(Errors.Something_Went_Wrong, err));
    }
};

module.exports = {
    addSkill,
    getAllSkills,
    updateSkillById,
    deleteSkillById
};
