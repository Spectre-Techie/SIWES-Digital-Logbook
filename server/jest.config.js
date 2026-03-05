/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    clearMocks: true,
    restoreMocks: true,
    testTimeout: 15000,
    verbose: true,
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/config/env.js',
        '!src/utils/logger.js',
    ],
};
