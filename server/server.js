const app = require('./src/app');
const { PORT } = require('./src/config/env');
const logger = require('./src/utils/logger');
const { prisma, warmUp } = require('./src/config/database');

const server = app.listen(PORT, async () => {
    try {
        await prisma.$connect();
        // Fire-and-forget warm-up query to prime Prisma Accelerate connection
        warmUp().catch(() => {});
        logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    } catch (error) {
        logger.error('Failed to connect to database', { error: error.message });
        process.exit(1);
    }
});

// Graceful shutdown
const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        await prisma.$disconnect();
        logger.info('Database connection closed.');
        process.exit(0);
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', { reason });
    process.exit(1);
});
