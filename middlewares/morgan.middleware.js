const morgan = require('morgan');
const { logInfo } = require('../utils/logger');

const morganMiddleware = morgan('tiny', {
    stream: {
        write: (message) => logInfo(message.trim())
    }
});

module.exports = morganMiddleware;
