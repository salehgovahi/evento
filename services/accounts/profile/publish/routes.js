const express = require('express');
const router = express.Router( );
const generalController = require('./controller');
const validator = require('../../../../middlewares/joi-validator');
const skillSchema = require('./schema');
const { checkToken } = require('../../../../middlewares/jwtCheck');
const checkAccess = require('../../../../middlewares/checkAccess');

// Get all skills
router.get('/pendings', checkAccess, generalController.getPendingProfilesToPublish);

// Get skills by id
router.put('/request', checkToken, generalController.requestPublishProfile);

// Get all skills
router.put('/modify', checkAccess, generalController.modifyProfileStatus);

module.exports = router;
