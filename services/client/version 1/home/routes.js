const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Get Courses
router.get('/getcourses', controller.getCourses);

// Get Roadmaps
router.get('/getroadmaps', controller.getRoadmaps);

// Get Roadmaps
router.get('/get-bootcamps', controller.getBootCamps);
module.exports = router;
