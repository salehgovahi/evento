const timeoutMiddleware = (req, res, next) => {
    res.setTimeout(600000, () => {
        console.log('Request has timed out.');
        res.status(408).send('Request has timed out.');
    });
    next();
};

module.exports = timeoutMiddleware;
