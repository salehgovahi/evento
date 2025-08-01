const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Check Postgres Status
router.get('/postgres', controller.checkPostgresStatus);

// Check Mongodb Status
router.get('/mongo', controller.checkMongoStatus);

// Check RabbitMQ Status
router.get('/rabbitmq', controller.checkRabbitMQStatus);

// Check Kavenegar Status
router.get('/kavenegar', controller.checkKavenegarStatus);

module.exports = router;
