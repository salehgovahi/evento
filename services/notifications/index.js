const express = require('express');
const router = express.Router({ mergeParams: true});

const templatesRoutes = require('./templates/routes');
const managementRoutes = require('./management/routes');

router.use('/templates', templatesRoutes);

router.use('/', managementRoutes);

module.exports = router;
