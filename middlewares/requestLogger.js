const logger = require('./winstonLogger');
const { v4: uuidv4 } = require('uuid');

const requestLogger = (req, res, next) => {    
    const startHrTime = process.hrtime();

    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    req.correlationId = correlationId;

    const originalSend = res.send;
    const originalJson = res.json;
    let responseBody = null;

    res.send = function (body) {
        responseBody = body;
        return originalSend.apply(this, arguments);
    };

    res.json = function (body) {
        responseBody = body;
        return originalJson.apply(this, arguments);
    };

    res.on('finish', () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const responseTime = (elapsedHrTime[0] * 1e3 + elapsedHrTime[1] / 1e6).toFixed(3);

        const logEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            status_code: res.statusCode,
            query_params: req.query,
            request_body: req.body,
            response_body: responseBody,
            response_time_ms: parseFloat(responseTime),
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            correlation_id: correlationId,
            user_id: req.user_id || '-'
        };

        if (req.error) {
            logEntry.error_message = responseBody.error.message;
            logEntry.error_code = responseBody.error.code;
        }

        if (res.statusCode >= 500) {
            logger.error('Server Error', logEntry);
        } else if (res.statusCode >= 400) {
            logger.warn('Client Error', logEntry);
        } else {
            logger.info('Request Handled', logEntry);
        }
    });

    next();
};

module.exports = requestLogger;
