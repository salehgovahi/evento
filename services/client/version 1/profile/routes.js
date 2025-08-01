const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Get all undeleted advertisement banners
router.get('/:profile_id', controller.getProfile);

module.exports = router;
