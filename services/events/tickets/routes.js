const express = require('express');
const router = express.Router({ mergeParams: true });
const ticketController = require('./controller');
const registrationSchema = require('./schema');
const validator = require('../../../middlewares/joi-validator');
const { checkToken } = require('../../../middlewares/jwtCheck');

// Create Ticket
router.post('/', ticketController.generateTicket);

module.exports = router;
