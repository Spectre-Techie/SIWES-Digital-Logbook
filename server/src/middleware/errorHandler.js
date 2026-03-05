const { AppError } = require('../utils/errors');
const logger = require('../utils/logger');

const globalErrorHandler = (err, req, res, next) => {
    // Operational errors (known, expected)
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                ...(err.field && { field: err.field }),
                ...(err.errors && { errors: err.errors }),
            },
        });
    }

    // Prisma constraint violations
    if (err.code === 'P2002') {
        return res.status(409).json({
            success: false,
            error: {
                code: 'DUPLICATE_ENTRY',
                message: `A record already exists for this ${err.meta?.target?.join(', ')}.`,
            },
        });
    }

    // Prisma record not found
    if (err.code === 'P2025') {
        return res.status(404).json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Record not found.' },
        });
    }

    // Prisma connection errors (DB unreachable, cold start, no internet)
    if (
        err.code === 'P1001' ||
        err.code === 'P1002' ||
        err.code === 'P1003' ||
        err.message?.includes("Can't reach database") ||
        err.message?.includes('ENOTFOUND') ||
        err.message?.includes('ETIMEDOUT') ||
        err.message?.includes('ECONNREFUSED')
    ) {
        logger.error('Database connection error', { code: err.code, message: err.message });
        return res.status(503).json({
            success: false,
            error: {
                code: 'SERVICE_UNAVAILABLE',
                message: 'Unable to connect. Please check your internet connection and try again.',
            },
        });
    }

    // Unknown/programming errors
    logger.error('Unexpected error', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message:
                process.env.NODE_ENV === 'production'
                    ? 'Something went wrong. Please try again.'
                    : err.message,
        },
    });
};

const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'ROUTE_NOT_FOUND',
            message: `Route ${req.method} ${req.originalUrl} does not exist.`,
        },
    });
};

module.exports = { globalErrorHandler, notFoundHandler };
