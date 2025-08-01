const express = require('express');
const router = express.Router();

const contentRoutes = require('./content/routes');
const participantsRoutes = require('./participants/routes');
const registerRoutes = require('./register/routes');
const ticketsRoutes = require('./tickets/routes');
const speakersRoutes = require('./speakers/routes');
const sessionsRoutes = require('./sessions/routes');

router.use('/:event_id/sessions', sessionsRoutes);
router.use('/:event_id/speakers', speakersRoutes);
router.use('/:event_id/register', registerRoutes);
router.use('/:event_id/participants', participantsRoutes);
router.use('/content', contentRoutes);
router.use('/tickets', ticketsRoutes);
module.exports = router;
