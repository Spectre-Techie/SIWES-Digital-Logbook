const { prisma } = require('../config/database');
const { PAGINATION, LOG_STATUS } = require('../config/constants');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const logger = require('../utils/logger');

// Get all students assigned to this supervisor
const getStudents = async (userId, query = {}) => {
    const page = parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = {
        supervisorId: userId,
    };

    // Search by student name or matric no
    if (query.search) {
        where.user = {
            OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
            ],
        };
    }

    const [students, total] = await prisma.$transaction([
        prisma.student.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
                _count: {
                    select: {
                        logs: true,
                        attendance: true,
                    },
                },
            },
            orderBy: { user: { name: 'asc' } },
            skip,
            take: limit,
        }),
        prisma.student.count({ where }),
    ]);

    // Shape the response
    const data = students.map((s) => ({
        id: s.id,
        userId: s.user.id,
        name: s.user.name,
        email: s.user.email,
        matricNo: s.matricNo,
        companyName: s.companyName,
        department: s.department,
        totalLogs: s._count.logs,
        totalAttendance: s._count.attendance,
    }));

    return {
        data,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

// Get a specific student's logs (for review)
const getStudentLogs = async (supervisorUserId, studentId, query = {}) => {
    // Verify this student belongs to this supervisor
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { supervisor: true },
    });
    if (!student) throw new NotFoundError('Student');
    if (student.supervisor.id !== supervisorUserId) {
        throw new ForbiddenError('This student is not assigned to you');
    }

    const page = parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = { studentId };
    if (query.status) where.status = query.status;

    const [logs, total] = await prisma.$transaction([
        prisma.log.findMany({
            where,
            orderBy: { date: 'desc' },
            skip,
            take: limit,
        }),
        prisma.log.count({ where }),
    ]);

    return {
        student: {
            id: student.id,
            name: (await prisma.user.findUnique({ where: { id: student.userId } })).name,
            companyName: student.companyName,
        },
        data: logs,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

// Approve a single log
const approveLog = async (supervisorUserId, logId, comment) => {
    const log = await prisma.log.findUnique({
        where: { id: logId },
        include: { student: { include: { supervisor: true } } },
    });
    if (!log) throw new NotFoundError('Log entry');
    if (log.student.supervisor.id !== supervisorUserId) {
        throw new ForbiddenError('This student is not assigned to you');
    }

    const updated = await prisma.log.update({
        where: { id: logId },
        data: {
            status: LOG_STATUS.APPROVED,
            supervisorComment: comment || null,
        },
    });

    logger.info('Log approved', { logId, supervisorUserId });
    return updated;
};

// Reject a single log
const rejectLog = async (supervisorUserId, logId, comment) => {
    if (!comment || comment.trim().length < 5) {
        throw new ForbiddenError('A rejection comment of at least 5 characters is required');
    }

    const log = await prisma.log.findUnique({
        where: { id: logId },
        include: { student: { include: { supervisor: true } } },
    });
    if (!log) throw new NotFoundError('Log entry');
    if (log.student.supervisor.id !== supervisorUserId) {
        throw new ForbiddenError('This student is not assigned to you');
    }

    const updated = await prisma.log.update({
        where: { id: logId },
        data: {
            status: LOG_STATUS.REJECTED,
            supervisorComment: comment.trim(),
        },
    });

    logger.info('Log rejected', { logId, supervisorUserId });
    return updated;
};

// Bulk approve logs
const bulkApprove = async (supervisorUserId, logIds) => {
    // Verify all logs belong to supervisor's students
    const logs = await prisma.log.findMany({
        where: { id: { in: logIds } },
        include: { student: { include: { supervisor: true } } },
    });

    if (logs.length !== logIds.length) {
        throw new NotFoundError('One or more log entries');
    }

    const unauthorized = logs.find((l) => l.student.supervisor.id !== supervisorUserId);
    if (unauthorized) {
        throw new ForbiddenError('One or more students are not assigned to you');
    }

    const result = await prisma.log.updateMany({
        where: { id: { in: logIds }, status: LOG_STATUS.PENDING },
        data: { status: LOG_STATUS.APPROVED },
    });

    logger.info('Bulk approve', { count: result.count, supervisorUserId });
    return { approved: result.count };
};

module.exports = { getStudents, getStudentLogs, approveLog, rejectLog, bulkApprove };
