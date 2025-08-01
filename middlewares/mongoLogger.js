const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    method: { type: String, required: true },
    url: { type: String, required: true },
    headers: { type: Object },
    query_params: { type: Object },
    request_body: { type: Object },

    status_code: { type: Number, required: true },
    response_body: { type: Object },
    response_time: { type: Number },

    timestamp: { type: Date, default: Date.now },
    user_id: { type: String },
    user_ip: { type: String },
    ip_address: { type: String },
    correlation_id: { type: String },

    error_message: { type: String },
    stack_trace: { type: String },
    error_code: { type: String }
});

const Log = mongoose.model('Log', logSchema);

const logger = async (req, res, next) => {
    const startTime = Date.now();

    const rawIpAddress = req.ip;

    const ipAddressMatch = rawIpAddress.match(/(\d+\.\d+\.\d+\.\d+)$/);
    const ipAddress = ipAddressMatch ? ipAddressMatch[1] : rawIpAddress;

    const logEntry = new Log({
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        user_ip: req.headers['x-forwarded-for'] ?? '',
        query_params: req.query,
        request_body: req.body,
        ip_address: ipAddress,
        user_id: req.user ? req.user.id : null,
        correlation_id: req.headers['x-correlation-id'] || null,
        timestamp: new Date()
    });

    const originalSend = res.send;

    res.send = function (body) {
        let parsedBody;

        if (typeof body === 'string') {
            try {
                parsedBody = JSON.parse(body);
            } catch (e) {
                parsedBody = body;
            }
        } else {
            parsedBody = body;
        }

        const response_time = Date.now() - startTime;

        logEntry.status_code = res.statusCode;
        logEntry.response_body = parsedBody;
        logEntry.user_id = req.user_id ?? '';
        logEntry.response_time = response_time;

        if (res.status_code >= 400 && parsedBody && parsedBody.error) {
            logEntry.error_message = parsedBody.error.message || 'Unknown error';
            logEntry.error_code = parsedBody.error.status_code || null;
        }

        logEntry.save();

        return originalSend.call(this, body);
    };

    next();
};

module.exports = logger;
