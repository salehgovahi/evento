const express = require('express');
const router = express.Router();
const eventController = require('./controller');
const contentSchema = require('./schema');
const { checkToken } = require('../../../middlewares/jwtCheck');
const checkAccess = require('../../../middlewares/checkAccess');
const { upload, uploadImage, uploadVideo } = require('../../../middlewares/uploadFile');
const validator = require('../../../middlewares/joi-validator');

router.post(
    '/',
    [validator(contentSchema.addEvent, 'body'), checkAccess],
    eventController.addEvent
);

router.post(
    '/:event_id/poster',
    [uploadImage.single('file'), checkAccess],
    eventController.uploadPoster
);

router.post(
    '/:event_id/video',
    [uploadVideo.single('file'), checkAccess],
    eventController.uploadVideo
);

router.get('/', checkAccess, eventController.getAllEvent);

router.get('/:event_id', checkAccess, eventController.getEventById);

router.delete('/:event_id', checkAccess, eventController.deleteEvent);

router.put('/:event_id/undelete', checkAccess, eventController.undeleteEvent);

router.patch(
    '/:event_id/',
    [validator(contentSchema.updateEvent, 'body'), checkAccess],
    eventController.updateEventPatch
);

module.exports = router;
