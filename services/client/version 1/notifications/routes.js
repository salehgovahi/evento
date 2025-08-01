const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { checkToken } = require('../../../../middlewares/jwtCheck');

// Get My Notifications
router.get('/', checkToken, controller.getAllNotifications);

module.exports = router;
