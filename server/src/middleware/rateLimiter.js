const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Too many login attempts. Please wait 15 minutes.' },
    },
    skipSuccessfulRequests: true,
});

const exportLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Export limit reached. Please wait before downloading again.' },
    },
});

module.exports = { generalLimiter, authLimiter, exportLimiter };
