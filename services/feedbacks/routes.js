const express = require('express');
const router = express.Router();
const feedbackController = require('./controller');
const contentSchema = require('./schema');
const dbFunctions = require('./dbFunctions');
const { checkToken } = require('../../middlewares/jwtCheck');

// Feedback fot course
router.post('/course/:course_id/add-feedback', checkToken, feedbackController.addCourseFeedback);
router.get('/course/:course_id/get-feedback', feedbackController.getCourseFeedback);
router.get(
    '/course/:course_id/get-not-confirm-feedback',
    feedbackController.notConfirmedCourseFeedback
);
router.get('/course/:course_id/get-user-course-feedback', feedbackController.getUserCourseFeedback);

// action for all Feedback
router.get('/', feedbackController.getAllFeedback);
router.put('/confirm-feedback', feedbackController.confirmFeedback);
router.get('/:feedback_id', feedbackController.getFeedbackById);
router.put('/:feedback_id', feedbackController.updateFeedback);
router.put('/delete-feedback', feedbackController.deleteFeedback);
router.put('/undelete-feedback', feedbackController.undeleteFeedback);

module.exports = router;
