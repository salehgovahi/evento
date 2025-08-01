const express = require('express');
const router = express.Router({ mergeParams: true});

const personalInformationRoutes = require('./personalInformation/routes');

// Personal Information Routes
router.use('/personal', personalInformationRoutes);

module.exports = router;
