const express = require('express');
const router = express.Router();
const degreeController = require('./controller');
const validator = require('../../../../middlewares/joi-validator');
const degreeSchema = require('./schema');
const { checkToken } = require('../../../../middlewares/jwtCheck');

// Get degrees by id
router.post('/', checkToken, degreeController.addDegree);

// Get all degrees
router.get('/', checkToken, degreeController.getAllDegrees);

// Get degree by id
router.get('/:degree_id', checkToken, degreeController.getDegreeById);

// Update degree by id
router.patch('/:degree_id', checkToken, degreeController.updateDegreeById);

// Delete degree by id
router.delete('/:degree_id', checkToken, degreeController.deleteDegreeById);

module.exports = router;
