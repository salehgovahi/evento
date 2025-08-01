const express = require('express');
const router = express.Router();
const skillsController = require('./controller');
const validator = require('../../../middlewares/joi-validator');
const skillsSchema = require('./schema');
const checkAccess = require('../../../middlewares/checkAccess');

// Get Skills by id
router.post(
    '/',
    [validator(skillsSchema.addAndUpdateSkill, 'body'), checkAccess],
    skillsController.addSkill
);

// Get all Skills
router.get('/', checkAccess, skillsController.getAllSkills);

// Get Skills by id
router.patch(
    '/:skill_id',
    [validator(skillsSchema.addAndUpdateSkill, 'body'), checkAccess],
    skillsController.updateSkillById
);

// Delete Skill By Id
router.delete('/:skill_id', checkAccess, skillsController.deleteSkillById);

module.exports = router;
