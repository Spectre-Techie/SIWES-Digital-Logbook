const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { generalLimiter } = require('./middleware/rateLimiter');
const { FRONTEND_URL, NODE_ENV } = require('./config/env');

// Route imports
const authRoutes = require('./routes/auth.routes');
const logsRoutes = require('./routes/logs.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const supervisorRoutes = require('./routes/supervisor.routes');
const adminRoutes = require('./routes/admin.routes');
const statsRoutes = require('./routes/stats.routes');
const exportRoutes = require('./routes/export.routes');

// Error handler
const { globalErrorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// -- Security Middleware --
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    },
}));

app.use(cors({
    origin: NODE_ENV === 'production' ? FRONTEND_URL : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// -- Parsing Middleware --
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// -- Logging Middleware --
if (NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// -- Rate Limiting --
app.use('/api', generalLimiter);

// -- Health Check --
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// -- API Routes --
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/logs', logsRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/supervisor', supervisorRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/export', exportRoutes);

// -- Error Handling --
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
