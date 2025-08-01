const express = require('express');
const router = express.Router();

const homePageRouter = require('./home/routes');
const aboutUsPageRouter = require('./aboutUs/routes');
const dashboardPageRouter = require('./dashboard/routes');
const profileRouter = require('./profile/routes');

// Home Page Router
router.use('/home', homePageRouter);

// About Us Page Router
router.use('/about-us', aboutUsPageRouter);

// Dashboard Router
router.use('/dashboard', dashboardPageRouter);

// Profile Router
router.use('/profiles', profileRouter);

module.exports = router;
