const express = require('express');
const router = express.Router({ mergeParams: true });
const registerController = require('./controller');
const registrationSchema = require('./schema');
const validator = require('../../../middlewares/joi-validator');
const { checkToken } = require('../../../middlewares/jwtCheck');
const { upload } = require('../../../middlewares/uploadFile');

// Create Registration
router.post(
    '/',
    [validator(registrationSchema.registerSchema, 'body'), checkToken],
    registerController.register
);

// Update Registration
router.patch(
    '/',
    [validator(registrationSchema.updateRegistrationSchema, 'body'), checkToken],
    registerController.updateRegister
);

// Upload CV
router.post(
    '/:participant_id/cv',
    [upload.single('file'), checkToken],
    registerController.uploadCV
);

// Upload Motivation Letter
router.post(
    '/:participant_id/motivation-letter',
    [upload.single('file'), checkToken],
    registerController.uploadMotivationLetter
);

// Upload Challenge
router.post(
    '/:participant_id/challenge',
    [upload.single('file'), checkToken],
    registerController.uploadChallenge
);

module.exports = router;
