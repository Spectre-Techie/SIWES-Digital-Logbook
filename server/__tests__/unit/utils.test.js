// ── Unit tests for utility functions ─────────────────────────────────────
const { isLateEntry, isFutureDate } = require('../../src/utils/dateUtils');
const { AppError, ValidationError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, ImmutableRecordError } = require('../../src/utils/errors');
const { success, created } = require('../../src/utils/response');

// ── dateUtils ───────────────────────────────────────────────────────────
describe('dateUtils', () => {
    describe('isLateEntry', () => {
        it('returns false for a date within the late entry window (≤3 days ago)', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(isLateEntry(yesterday.toISOString())).toBe(false);
        });

        it('returns true for a date beyond the late entry window (>3 days ago)', () => {
            const fiveDaysAgo = new Date();
            fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
            expect(isLateEntry(fiveDaysAgo.toISOString())).toBe(true);
        });

        it('returns false for today', () => {
            expect(isLateEntry(new Date().toISOString())).toBe(false);
        });
    });

    describe('isFutureDate', () => {
        it('returns true for a date in the future', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            expect(isFutureDate(tomorrow.toISOString())).toBe(true);
        });

        it('returns false for today', () => {
            expect(isFutureDate(new Date().toISOString())).toBe(false);
        });

        it('returns false for a past date', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(isFutureDate(yesterday.toISOString())).toBe(false);
        });
    });
});

// ── errors ──────────────────────────────────────────────────────────────
describe('errors', () => {
    it('AppError sets statusCode, code, and isOperational', () => {
        const err = new AppError('test', 418, 'TEAPOT');
        expect(err.message).toBe('test');
        expect(err.statusCode).toBe(418);
        expect(err.code).toBe('TEAPOT');
        expect(err.isOperational).toBe(true);
        expect(err).toBeInstanceOf(Error);
    });

    it('ValidationError is 400', () => {
        const err = new ValidationError('bad input', 'email');
        expect(err.statusCode).toBe(400);
        expect(err.field).toBe('email');
    });

    it('UnauthorizedError is 401 with default message', () => {
        const err = new UnauthorizedError();
        expect(err.statusCode).toBe(401);
        expect(err.message).toBe('Authentication required');
    });

    it('ForbiddenError is 403', () => {
        const err = new ForbiddenError();
        expect(err.statusCode).toBe(403);
    });

    it('NotFoundError is 404 with resource name', () => {
        const err = new NotFoundError('User');
        expect(err.statusCode).toBe(404);
        expect(err.message).toBe('User not found');
    });

    it('ConflictError is 409', () => {
        const err = new ConflictError('Already exists');
        expect(err.statusCode).toBe(409);
    });

    it('ImmutableRecordError is 422', () => {
        const err = new ImmutableRecordError();
        expect(err.statusCode).toBe(422);
        expect(err.message).toContain('Approved');
    });
});

// ── response helpers ────────────────────────────────────────────────────
describe('response helpers', () => {
    const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it('success() returns 200 with data', () => {
        const res = mockRes();
        success(res, { id: 1 });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1 } });
    });

    it('success() includes meta when provided', () => {
        const res = mockRes();
        success(res, [], 200, { page: 1, total: 10 });
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: [],
            meta: { page: 1, total: 10 },
        });
    });

    it('created() returns 201', () => {
        const res = mockRes();
        created(res, { id: 'abc' });
        expect(res.status).toHaveBeenCalledWith(201);
    });
});
