// ── Integration tests: Health & Auth routes ─────────────────────────────
const request = require('supertest');
const app = require('../../src/app');

describe('Health endpoint', () => {
    it('GET /health returns 200 with status ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            status: 'ok',
            timestamp: expect.any(String),
        }));
    });
});

describe('404 handler', () => {
    it('returns 404 for unknown routes', async () => {
        const res = await request(app).get('/api/v1/nonexistent');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
    });
});

describe('Auth API - POST /api/v1/auth/register', () => {
    it('rejects registration with missing required fields', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('rejects registration with invalid email', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test User',
                email: 'not-an-email',
                password: 'Password1',
                role: 'student',
                companyName: 'Test Corp',
            });
        expect(res.status).toBe(400);
    });

    it('rejects registration with short password', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test User',
                email: 'test@test.com',
                password: '123',
                role: 'student',
                companyName: 'Test Corp',
            });
        expect(res.status).toBe(400);
    });

    it('rejects registration with invalid role', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'Test User',
                email: 'test@test.com',
                password: 'Password1',
                role: 'hacker',
                companyName: 'Test Corp',
            });
        expect(res.status).toBe(400);
    });
});

describe('Auth API - POST /api/v1/auth/login', () => {
    it('rejects login with missing credentials', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({});
        expect(res.status).toBe(400);
    });

    it('rejects login with non-existent email', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'noone@nowhere.com', password: 'Password123' });
        // Depending on whether DB is connected, this should be 401 or 503
        expect([401, 503]).toContain(res.status);
    });
});

describe('Auth API - GET /api/v1/auth/me', () => {
    it('rejects request without token', async () => {
        const res = await request(app).get('/api/v1/auth/me');
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('rejects request with invalid token', async () => {
        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', 'Bearer invalid.token.here');
        expect(res.status).toBe(401);
    });
});
