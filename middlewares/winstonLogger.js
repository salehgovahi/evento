const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;

const environments = require('../configs/environments');

const logDir = environments.LOG_PATH;
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logger = createLogger({
    level: 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
    transports: [
        new transports.File({ filename: path.join(logDir, 'errors.log'), level: 'error' }),
        new transports.File({ filename: path.join(logDir, 'requests.log'), level: 'info' }),
        // new transports.Console({ format: format.simple() }) // Optional
    ]
});

module.exports = logger;
