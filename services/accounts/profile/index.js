const express = require('express');
const router = express.Router({ mergeParams: true });

const degreesRoutes = require('./degrees/routes');
const skillsRoutes = require('./skills/routes');
const socialNetworksRoutes = require('./socialNetworks/routes');
const contentRoutes = require('./content/routes');
const publishRoutes = require('./publish/routes')

// Content Routes
router.use('/', contentRoutes);

// Publish Routes
router.use('/publish', publishRoutes);

// Degrees Routes
router.use('/:profile_id/degrees', degreesRoutes);

// Skills Routes
router.use('/:profile_id/skills', skillsRoutes);

// Social Networks Routes
router.use('/:profile_id/socials', socialNetworksRoutes);

module.exports = router;
