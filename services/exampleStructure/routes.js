const express = require('express');
const router = express.Router();
const galleryController = require('./controller');
const validator = require('../../middlewares/joi-validator');
const gallerySchema = require('./schema');

// Get videos by id
router.post('/', galleryController.addVideo);

// Get all Videos
router.get('/', galleryController.getAllVideos);

// Get videos by id
router.get('/:video_id', galleryController.getVideoById);

// Get videos by id
router.patch('/:video_id', galleryController.updateVideoById);

router.delete('/:video_id', galleryController.deleteVideoById);

router.put('/:video_id/undelete', galleryController.undeleteVideoById);
module.exports = router;
