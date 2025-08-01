const express = require('express');
const router = express.Router();
const skillController = require('./controller');
const validator = require('../../../../middlewares/joi-validator');
const skillSchema = require('./schema');
const { checkToken } = require('../../../../middlewares/jwtCheck');

// Get skills by id
router.post('/', checkToken, skillController.addSkill);

// Get all skills
router.get('/', checkToken, skillController.getAllAssignedSkills);

// Get all defined skills
router.get('/defined', checkToken, skillController.getAllDefinedSkills);


module.exports = router;
