const express = require('express');
const router = express.Router({ mergeParams: true });
const speakersController = require('./controller');
const checkAccess = require('../../../middlewares/checkAccess');
const { uploadImage } = require('../../../middlewares/uploadFile');

// Add Speakers to Event
router.post('/', [uploadImage.single('file'), checkAccess], speakersController.addSpeakers);

// Get All Speakers of Event
router.get('/', checkAccess, speakersController.getAllSpeakers);

// Get Speaker Information By ID
router.get('/:speaker_id', checkAccess, speakersController.getSpeakerById);

// Update Speaker Information By ID
router.patch('/:speaker_id', checkAccess, speakersController.updateSpeaker);

// Delete Speaker By Id
router.delete('/:speaker_id', checkAccess, speakersController.deleteSpeaker);

// UnDelete Speaker By Id
router.put('/:speaker_id', checkAccess, speakersController.unDeleteSpeaker);

// router.get('/:participant_id', checkAccess, speakersController.getParticipantById);

module.exports = router;
