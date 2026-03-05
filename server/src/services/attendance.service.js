const { prisma } = require('../config/database');
const { NotFoundError, ConflictError, ForbiddenError } = require('../utils/errors');
const { isFutureDate } = require('../utils/dateUtils');
const { startOfDay } = require('date-fns');
const logger = require('../utils/logger');

const markAttendance = async (userId, data) => {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundError('Student profile');

    const attDate = new Date(data.date);
    if (isFutureDate(data.date)) {
        throw new ForbiddenError('Cannot mark attendance for future dates');
    }

    // Only allow marking attendance for today
    const todayStart = startOfDay(new Date());
    const dateStart = startOfDay(attDate);
    if (dateStart.getTime() !== todayStart.getTime()) {
        throw new ForbiddenError('Attendance can only be marked for today');
    }

    // Upsert: update if exists, create if not
    const attendance = await prisma.attendance.upsert({
        where: {
            unique_student_attendance_per_day: {
                studentId: student.id,
                date: attDate,
            },
        },
        update: {
            status: data.status,
        },
        create: {
            studentId: student.id,
            date: attDate,
            status: data.status,
        },
    });

    logger.info('Attendance marked', { attendanceId: attendance.id, studentId: student.id, status: data.status });
    return attendance;
};

const getAttendance = async (userId, query = {}) => {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundError('Student profile');

    const now = new Date();
    const month = parseInt(query.month, 10) || now.getMonth() + 1;
    const year = parseInt(query.year, 10) || now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const records = await prisma.attendance.findMany({
        where: {
            studentId: student.id,
            date: { gte: startDate, lte: endDate },
        },
        orderBy: { date: 'asc' },
    });

    // Summary stats
    const summary = {
        total: records.length,
        present: records.filter((r) => r.status === 'present').length,
        absent: records.filter((r) => r.status === 'absent').length,
        excused: records.filter((r) => r.status === 'excused').length,
        month,
        year,
    };
    summary.rate = summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0;

    return { records, summary };
};

module.exports = { markAttendance, getAttendance };
