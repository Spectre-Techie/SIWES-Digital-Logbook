// ── Unit tests for config/constants ─────────────────────────────────────
const { ROLES, LOG_STATUS, ATTENDANCE_STATUS, PAGINATION, LATE_ENTRY_DAYS } = require('../../src/config/constants');

describe('constants', () => {
    it('defines all three user roles', () => {
        expect(ROLES).toEqual({
            STUDENT: 'student',
            SUPERVISOR: 'supervisor',
            FACULTY_ADMIN: 'faculty_admin',
        });
    });

    it('defines log statuses', () => {
        expect(LOG_STATUS).toEqual({
            PENDING: 'pending',
            APPROVED: 'approved',
            REJECTED: 'rejected',
        });
    });

    it('defines attendance statuses', () => {
        expect(ATTENDANCE_STATUS).toEqual({
            PRESENT: 'present',
            ABSENT: 'absent',
            EXCUSED: 'excused',
        });
    });

    it('has sensible pagination defaults', () => {
        expect(PAGINATION.DEFAULT_PAGE).toBe(1);
        expect(PAGINATION.DEFAULT_LIMIT).toBeGreaterThan(0);
        expect(PAGINATION.MAX_LIMIT).toBeGreaterThanOrEqual(PAGINATION.DEFAULT_LIMIT);
    });

    it('LATE_ENTRY_DAYS is a positive number', () => {
        expect(LATE_ENTRY_DAYS).toBeGreaterThan(0);
    });
});
