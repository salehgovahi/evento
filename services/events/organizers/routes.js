const express = require('express');
const router = express.Router({ mergeParams: true });
const validator = require('../../../middlewares/joi-validator');
const organizerSchema = require('./schema');
const checkAccess = require('../../../middlewares/checkAccess');
const { upload } = require('../../../middlewares/uploadFile');
const organizerController = require('./controller');

router.post(
    '/create',
    [checkAccess, validator(organizerSchema.createOrganizer, 'body')],
    organizerController.createOrganizer
);

router.post(
    '/:organizer_id/upload/image',
    [checkAccess, upload.single('file')],
    organizerController.uploadImage
);

router.get('/', checkAccess, organizerController.getAllOrganizers);

// Get Course By Id
router.get(
    '/:organizer_id',
    [checkAccess, validator(organizerSchema.validateOrganizerId, 'params')],
    organizerController.getOrganizerById
);

// Update Course
router.put(
    '/update',
    [checkAccess, validator(organizerSchema.updateOrganizer, 'body')],
    organizerController.updateOrganizer
);

router.put(
    '/:organizer_id/delete',
    [checkAccess, validator(organizerSchema.validateOrganizerId, 'params')],
    organizerController.deleteOrganizerById
);

router.put(
    '/:organizer_id/undelete',
    [checkAccess, validator(organizerSchema.validateOrganizerId, 'params')],
    organizerController.undeleteOrganizerById
);

module.exports = router;
