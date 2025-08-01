const express = require('express');
const router = express.Router({ mergeParams: true });
const participantsController = require('./controller');
const { checkToken } = require('../../../middlewares/jwtCheck');
const checkAccess = require('../../../middlewares/checkAccess');

// Get All Registered Users
router.post('/', checkAccess, participantsController.addParticipant);

// Get All Registered Users
router.get('/', checkAccess, participantsController.getAllRegisteredUsers);

module.exports = router;
