const { logError } = require('./logger');
const { metrics } = require('./telemetry');

class HttpError extends Error {
    constructor(error, mainLog = null) {
        if (mainLog) {
            console.log(mainLog);
            logError(mainLog);
        }
        let message = error.message;
        super(message);
        this.code = error.code;
        this.statusCode = error.statusCode;
        metrics.errorCount.add(1, {
            error_type: error.code,
            error_message: message,
            service: 'api'
        });
    }
}

module.exports = HttpError;
