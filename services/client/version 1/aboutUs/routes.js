const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Get Statistics
router.get('/get-statistics', controller.getStatistics);

module.exports = router;
