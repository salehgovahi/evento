const express = require('express');
const router = express.Router();
const contentController = require('./controller');
const validator = require('../../../../middlewares/joi-validator');
const contentSchema = require('./schema');
const { checkToken } = require('../../../../middlewares/jwtCheck');
const { uploadImage } = require('../../../../middlewares/uploadFile');

// Create profile
router.post('/', checkToken, contentController.createProfile);

// Update Image Profile
router.post(
    '/:profile_id/',
    [checkToken, uploadImage.single('file')],
    contentController.updateImageProfile
);

// Update about me
router.post(
    '/:profile_id/about',
    [validator(contentSchema.updateAboutMe, 'body'), checkToken],
    contentController.updateAboutMe
);

// Update about me
router.post(
    '/:profile_id/title',
    [validator(contentSchema.updateTitle, 'body'), checkToken],
    contentController.updateTitle
);

module.exports = router;
