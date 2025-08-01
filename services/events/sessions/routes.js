const express = require('express');
const router = express.Router({ mergeParams: true });
const sessionsController = require('./controller');
const checkAccess = require('../../../middlewares/checkAccess');

// Add Session to Event
router.post('/', checkAccess, sessionsController.addSession);

// Get All Sessions of Event
router.get('/', checkAccess, sessionsController.getAllSessions);

// Get Session Information By ID
router.get('/:speaker_id', checkAccess, sessionsController.getSessionById);

// Update Session Information By ID
router.patch('/:speaker_id', checkAccess, sessionsController.updateSession);

// Delete Session By Id
router.delete('/:speaker_id', checkAccess, sessionsController.deleteSession);

// UnDelete Session By Id
router.put('/:speaker_id', checkAccess, sessionsController.unDeleteSession);

// router.get('/:participant_id', checkAccess, sessionsController.getParticipantById);

module.exports = router;
