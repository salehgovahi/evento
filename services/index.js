const express = require('express');
const router = express.Router();

const accessesRouter = require('./accesses/routes');
const accountsRouter = require('./accounts/index')
const authenticationRouter = require('./authentication/routes');
const rolesRouter = require('./roles/routes');
const usersRouter = require('./users/routes');
const clientRouter = require('./client/index');
const feedbackRouter = require('./feedbacks/routes');
const profileRouter = require('./profile/routes');
// const certificateRouter = require('./certificates/routes');
const contactRouter = require('./contactUs/routes');
const eventRouter = require('./events/index');
const healthCheckRoutes = require('./healthCheck/routes');
const reducedLinkRoutes = require('./reduceLink/routes');

const notificationRoutes = require('./notifications/index');

// Accesses Routes
router.use('/accesses', accessesRouter);

// Accounts Routes
router.use('/accounts', accountsRouter);

// Authentication Routes
router.use('/auth', authenticationRouter);

// Roles Routes
router.use('/roles', rolesRouter);

// Users Routes
router.use('/users', usersRouter);

// Client Routes
router.use('/client', clientRouter);

// Comments Routes
router.use('/feedbacks', feedbackRouter);

// Profile Routes
router.use('/profile', profileRouter);

// // Certificate Routes
// router.use('/certificates', certificateRouter);

// // Talent Routes
// router.use('/talent', talentRouter);

// Contact Us Routes
router.use('/contact-us', contactRouter);

// Event Routes
router.use('/events', eventRouter);

// Heath Check Routes
router.use('/health-check', healthCheckRoutes);

// Reduced Links Routes
router.use('/links', reducedLinkRoutes);

// Notification Routes
router.use('/notifications', notificationRoutes);

module.exports = router;
