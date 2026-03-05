// ── Integration tests: Protected routes (logs, attendance, supervisor, admin) ──
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Helper to create valid JWT tokens for testing
const createToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

const studentToken = createToken({ userId: 'student-1', role: 'student' });
const supervisorToken = createToken({ userId: 'supervisor-1', role: 'supervisor' });
const adminToken = createToken({ userId: 'admin-1', role: 'faculty_admin' });

// ── Logs API ────────────────────────────────────────────────────────────
describe('Logs API', () => {
    describe('GET /api/v1/logs', () => {
        it('rejects unauthenticated request', async () => {
            const res = await request(app).get('/api/v1/logs');
            expect(res.status).toBe(401);
        });

        it('rejects non-student role', async () => {
            const res = await request(app)
                .get('/api/v1/logs')
                .set('Authorization', `Bearer ${supervisorToken}`);
            expect(res.status).toBe(403);
        });

        it('accepts student token (may fail if no DB profile)', async () => {
            const res = await request(app)
                .get('/api/v1/logs')
                .set('Authorization', `Bearer ${studentToken}`);
            // 200 if student profile exists, 404 if not, 503 if DB unreachable
            expect([200, 404, 503]).toContain(res.status);
        });
    });

    describe('POST /api/v1/logs', () => {
        it('rejects without auth', async () => {
            const res = await request(app)
                .post('/api/v1/logs')
                .send({ date: '2025-02-25', tasks: 'Test', hours: 8 });
            expect(res.status).toBe(401);
        });

        it('rejects with incomplete data', async () => {
            const res = await request(app)
                .post('/api/v1/logs')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({});
            expect(res.status).toBe(400);
        });

        it('rejects supervisor from creating logs', async () => {
            const res = await request(app)
                .post('/api/v1/logs')
                .set('Authorization', `Bearer ${supervisorToken}`)
                .send({ date: '2025-02-25', tasks: 'Test', hours: 8 });
            expect(res.status).toBe(403);
        });
    });
});

// ── Attendance API ──────────────────────────────────────────────────────
describe('Attendance API', () => {
    describe('GET /api/v1/attendance', () => {
        it('rejects unauthenticated request', async () => {
            const res = await request(app).get('/api/v1/attendance');
            expect(res.status).toBe(401);
        });

        it('accepts student token', async () => {
            const res = await request(app)
                .get('/api/v1/attendance')
                .set('Authorization', `Bearer ${studentToken}`);
            expect([200, 404, 503]).toContain(res.status);
        });
    });

    describe('POST /api/v1/attendance', () => {
        it('rejects without required fields', async () => {
            const res = await request(app)
                .post('/api/v1/attendance')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({});
            expect(res.status).toBe(400);
        });

        it('rejects invalid status value', async () => {
            const res = await request(app)
                .post('/api/v1/attendance')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({ date: '2025-02-25', status: 'flying' });
            expect(res.status).toBe(400);
        });
    });
});

// ── Supervisor API ──────────────────────────────────────────────────────
describe('Supervisor API', () => {
    describe('GET /api/v1/supervisor/students', () => {
        it('rejects student role', async () => {
            const res = await request(app)
                .get('/api/v1/supervisor/students')
                .set('Authorization', `Bearer ${studentToken}`);
            expect(res.status).toBe(403);
        });

        it('accepts supervisor token', async () => {
            const res = await request(app)
                .get('/api/v1/supervisor/students')
                .set('Authorization', `Bearer ${supervisorToken}`);
            expect([200, 503]).toContain(res.status);
        });
    });
});

// ── Admin API ───────────────────────────────────────────────────────────
describe('Admin API', () => {
    describe('GET /api/v1/admin/students', () => {
        it('rejects student role', async () => {
            const res = await request(app)
                .get('/api/v1/admin/students')
                .set('Authorization', `Bearer ${studentToken}`);
            expect(res.status).toBe(403);
        });

        it('rejects supervisor role', async () => {
            const res = await request(app)
                .get('/api/v1/admin/students')
                .set('Authorization', `Bearer ${supervisorToken}`);
            expect(res.status).toBe(403);
        });

        it('accepts admin token', async () => {
            const res = await request(app)
                .get('/api/v1/admin/students')
                .set('Authorization', `Bearer ${adminToken}`);
            expect([200, 503]).toContain(res.status);
        });
    });

    describe('GET /api/v1/admin/supervisors', () => {
        it('rejects non-admin roles', async () => {
            const res = await request(app)
                .get('/api/v1/admin/supervisors')
                .set('Authorization', `Bearer ${studentToken}`);
            expect(res.status).toBe(403);
        });

        it('accepts admin token', async () => {
            const res = await request(app)
                .get('/api/v1/admin/supervisors')
                .set('Authorization', `Bearer ${adminToken}`);
            expect([200, 503]).toContain(res.status);
        });
    });

    describe('POST /api/v1/admin/assign', () => {
        it('rejects non-admin', async () => {
            const res = await request(app)
                .post('/api/v1/admin/assign')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({ studentIds: ['s1'], supervisorId: 'sup1' });
            expect(res.status).toBe(403);
        });

        it('rejects with missing body fields', async () => {
            const res = await request(app)
                .post('/api/v1/admin/assign')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({});
            expect(res.status).toBe(400);
        });
    });
});

// ── Stats API ───────────────────────────────────────────────────────────
describe('Stats API', () => {
    describe('GET /api/v1/stats', () => {
        it('rejects unauthenticated request', async () => {
            const res = await request(app).get('/api/v1/stats');
            expect(res.status).toBe(401);
        });

        it('accepts any authenticated user', async () => {
            const res = await request(app)
                .get('/api/v1/stats')
                .set('Authorization', `Bearer ${studentToken}`);
            expect([200, 404, 503]).toContain(res.status);
        });
    });
});

// ── Export API ──────────────────────────────────────────────────────────
describe('Export API', () => {
    describe('GET /api/v1/export/pdf', () => {
        it('rejects unauthenticated request', async () => {
            const res = await request(app).get('/api/v1/export/pdf');
            expect(res.status).toBe(401);
        });

        it('rejects non-student role', async () => {
            const res = await request(app)
                .get('/api/v1/export/pdf')
                .set('Authorization', `Bearer ${supervisorToken}`);
            expect(res.status).toBe(403);
        });
    });
});
