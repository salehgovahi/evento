const express = require('express');
const router = express.Router({ mergeParams: true});

const profileRoutes = require('./profile/index');
const settingsRouter = require('./settings/index');
const skillsRoutes = require('./skills/routes');

// Profile Routes
router.use('/profile', profileRoutes);

// Settings Routes
router.use('/settings', settingsRouter);

// Skills Routes
router.use('/skills', skillsRoutes);

module.exports = router;
