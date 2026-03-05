require('dotenv').config();

const required = ['DATABASE_URL', 'JWT_SECRET', 'NODE_ENV'];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
