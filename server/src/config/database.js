const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log:
        process.env.NODE_ENV === 'development'
            ? ['error', 'warn']
            : ['error'],
});

// Prisma Accelerate can have cold-start latency on the first request.
// This middleware retries once after a transient connection failure.
prisma.$use(async (params, next) => {
    try {
        return await next(params);
    } catch (error) {
        const isConnectionError =
            error?.message?.includes("Can't reach database server") ||
            error?.code === 'P1001' ||
            error?.code === 'P1002';

        if (isConnectionError) {
            // Wait briefly and retry once
            await new Promise((r) => setTimeout(r, 1500));
            return next(params);
        }
        throw error;
    }
});

// Warm up the connection pool so the first user request doesn't hit cold-start
const warmUp = async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch {
        // Non-fatal — first real request will retry via middleware
    }
};

module.exports = { prisma, warmUp };
