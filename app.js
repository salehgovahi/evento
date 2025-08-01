const express = require('express');
require('dotenv').config({});

const cors = require('cors');
const bodyParser = require('body-parser');

const HttpError = require('./utils/httpError');
const Errors = require('./const/errors');
const morganMiddleware = require('./middlewares/morgan.middleware');
const timeoutMiddleware = require('./middlewares/timeout.middleware');
const errorHandler = require('./middlewares/errorHandler');
const mongoLogger = require('./middlewares/mongoLogger');
const rateLimit = require('./middlewares/rateLimit');
const consumerRabbitmq = require('./utils/consumerRabbitmq');
const environments = require('./configs/environments');
const requestLogger = require('./middlewares/requestLogger');
const kavenegarHealthCheck = require('./services/healthCheck/kavenegarHealthCheck');
const databaseHealthCheck = require('./services/healthCheck/databaseHealthCheck');

const app = express();

// Middleware
// app.use(morganMiddleware);
app.use(bodyParser.json({ limit: '400mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '400mb' }));
app.use(cors());
app.use(express.json({ limit: '400mb' }));
// app.use(mongoLogger);
app.use(requestLogger);

// Rate Limit
app.use(rateLimit(40, 5));

// Set up request timeout
app.use(timeoutMiddleware);

// Route Setup
const mainRouter = require('./services/index');
app.use('', mainRouter);

// Handle 404
app.use((req, res, next) => {
    console.log('Route Not Found', req.originalUrl);
    const error = new HttpError(Errors.Route_Not_Found);
    throw error;
});

// Global Error Handler
app.use(errorHandler);

// Start kavenegar healthcheck
kavenegarHealthCheck();

// Start database healthcheck
databaseHealthCheck();

// Start receiving notification statuses
// consumerRabbitmq.receiveNotificationStatus(environments.RESPONSE_EMAIL_QUEUE_NAME);

// // Start receiving video statuses
// receiveVideosStatus(environments.GET_VIDEOS_STATUS_QUEUE);

module.exports = app;
