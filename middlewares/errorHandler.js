const HttpError = require('../utils/httpError');

const errorHandler = (error, req, res, next) => {
    console.log(error);
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.statusCode || 500);
    res.json({
        status: 'failed',
        statusCode: error.statusCode || 500,
        error: {
            code: error.code || -1,
            message: error.message || 'An unknown error occurred!',
            timestamp: new Date().toISOString(),
            path: req.originalUrl
        }
    });
};

module.exports = errorHandler;
