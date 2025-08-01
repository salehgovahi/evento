const { RateLimiterMemory } = require('rate-limiter-flexible');
const HttpError = require('../utils/httpError');
const environments = require('../configs/environments');

function rateLimitMiddleware(points, duration) {
    const rateLimiter = new RateLimiterMemory({
        points: points ?? environments.RATE_LIMIT_POINTS,
        duration: duration ?? environments.RATE_LIMIT_DURATION
    });

    return async function (req, res, next) {
        try {
            const { remainingPoints, msBeforeNext } = await rateLimiter.consume(
                req.headers['x-forwarded-for'],
                1
            );            

            res.set('X-Rate-Limit-Remaining', remainingPoints);
            res.set('X-Rate-Limit-MS-Before-Next', msBeforeNext);

            next();
        } catch (e) {
            console.log(e);
            next(
                new HttpError({
                    statusCode: 429,
                    code: 1020,
                    message: `'تعداد درخواست ها بیش از حد مجاز است. بعد از ${Math.ceil(e.msBeforeNext / 1000)} ثانیه دوباره تلاش کنید.`,
                })
            );
        }
    };
}

module.exports = rateLimitMiddleware;
