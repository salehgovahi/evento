const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { checkToken } = require('../../../../middlewares/jwtCheck');

// // Get My  Courses
// router.get('/my-courses', checkToken, controller.getMyCourses);

// // Get My Certificates
// router.get('/my-certificates', checkToken, controller.getMyCertificates);

// // Get My Qestions
// router.get('/my-questions', checkToken, controller.getMyQuestions);

// // Get My Qestions
// router.get('/my-bootcamps', checkToken, controller.getMyBootCamps);
module.exports = router;
