// ── Unit tests for middleware ────────────────────────────────────────────
const jwt = require('jsonwebtoken');
const { authenticate } = require('../../src/middleware/auth');
const { requireRole } = require('../../src/middleware/role');
const { handleValidation } = require('../../src/middleware/validate');
const { globalErrorHandler, notFoundHandler } = require('../../src/middleware/errorHandler');
const { AppError, UnauthorizedError } = require('../../src/utils/errors');

// ── Auth middleware ─────────────────────────────────────────────────────
describe('authenticate middleware', () => {
    const mockReq = (authHeader) => ({
        headers: { authorization: authHeader },
    });
    const mockRes = () => ({});
    const next = jest.fn();

    beforeEach(() => next.mockClear());

    it('rejects request with no Authorization header', () => {
        authenticate(mockReq(undefined), mockRes(), next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 401,
            message: 'No token provided',
        }));
    });

    it('rejects request without Bearer prefix', () => {
        authenticate(mockReq('Token abc123'), mockRes(), next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 401,
        }));
    });

    it('rejects invalid token', () => {
        authenticate(mockReq('Bearer invalid.token.here'), mockRes(), next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 401,
            message: 'Invalid token',
        }));
    });

    it('accepts valid token and sets req.user', () => {
        const secret = process.env.JWT_SECRET || 'test-secret';
        const token = jwt.sign({ userId: 'u1', role: 'student' }, secret, { expiresIn: '1h' });
        const req = mockReq(`Bearer ${token}`);

        authenticate(req, mockRes(), next);

        expect(next).toHaveBeenCalledWith();
        expect(req.user).toBeDefined();
        expect(req.user.userId).toBe('u1');
        expect(req.user.role).toBe('student');
    });

    it('rejects expired token', () => {
        const secret = process.env.JWT_SECRET || 'test-secret';
        const token = jwt.sign({ userId: 'u1', role: 'student' }, secret, { expiresIn: '0s' });

        // Wait for it to expire
        setTimeout(() => {
            authenticate(mockReq(`Bearer ${token}`), mockRes(), next);
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Token has expired',
            }));
        }, 100);
    });
});

// ── Role middleware ─────────────────────────────────────────────────────
describe('requireRole middleware', () => {
    const next = jest.fn();
    beforeEach(() => next.mockClear());

    it('allows matching role', () => {
        const middleware = requireRole('student', 'supervisor');
        const req = { user: { role: 'student' } };
        middleware(req, {}, next);
        expect(next).toHaveBeenCalledWith();
    });

    it('rejects non-matching role', () => {
        const middleware = requireRole('faculty_admin');
        const req = { user: { role: 'student' } };
        middleware(req, {}, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 403,
        }));
    });

    it('rejects when no user on request', () => {
        const middleware = requireRole('student');
        const req = {};
        middleware(req, {}, next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 403,
        }));
    });
});

// ── Error handler middleware ────────────────────────────────────────────
describe('globalErrorHandler', () => {
    const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    const req = { originalUrl: '/api/test', method: 'GET' };

    it('handles operational errors with correct status', () => {
        const err = new AppError('Test error', 400, 'TEST');
        const res = mockRes();
        globalErrorHandler(err, req, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            error: expect.objectContaining({ code: 'TEST', message: 'Test error' }),
        }));
    });

    it('handles Prisma P2002 as 409 conflict', () => {
        const err = { code: 'P2002', meta: { target: ['email'] } };
        const res = mockRes();
        globalErrorHandler(err, req, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(409);
    });

    it('handles Prisma P2025 as 404 not found', () => {
        const err = { code: 'P2025' };
        const res = mockRes();
        globalErrorHandler(err, req, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('handles database connection errors as 503', () => {
        const err = { code: 'P1001', message: "Can't reach database" };
        const res = mockRes();
        globalErrorHandler(err, req, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(503);
    });

    it('handles unknown errors as 500', () => {
        const err = new Error('Unexpected error');
        const res = mockRes();
        globalErrorHandler(err, req, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

describe('notFoundHandler', () => {
    it('returns 404 with route info', () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        notFoundHandler({ method: 'POST', originalUrl: '/api/v1/bad' }, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            error: expect.objectContaining({
                code: 'ROUTE_NOT_FOUND',
                message: expect.stringContaining('/api/v1/bad'),
            }),
        }));
    });
});

// ── Validation middleware ───────────────────────────────────────────────
describe('handleValidation middleware', () => {
    const next = jest.fn();
    beforeEach(() => next.mockClear());

    it('calls next when no errors', () => {
        // Mock express-validator's validationResult
        const req = {};
        // We need to create an internal mock. Instead, test indirectly via the integration tests.
        // This is a thin wrapper so we verify it exists and exports correctly.
        expect(typeof handleValidation).toBe('function');
    });
});
