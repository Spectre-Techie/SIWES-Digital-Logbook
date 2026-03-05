const { prisma } = require('../config/database');
const { PAGINATION, LOG_STATUS } = require('../config/constants');
const {
    NotFoundError,
    ConflictError,
    ImmutableRecordError,
    ForbiddenError,
} = require('../utils/errors');
const { isLateEntry, isFutureDate } = require('../utils/dateUtils');
const logger = require('../utils/logger');

const createLog = async (userId, data) => {
    // 1. Get student profile
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundError('Student profile');

    // 2. Validate date is not in the future
    if (isFutureDate(data.date)) {
        throw new ForbiddenError('Cannot log entries for future dates');
    }

    // 3. Check duplicate (one log per student per day)
    const logDate = new Date(data.date);
    const existing = await prisma.log.findUnique({
        where: {
            unique_student_log_per_day: {
                studentId: student.id,
                date: logDate,
            },
        },
    });
    if (existing) throw new ConflictError('A log entry already exists for this date');

    // 4. Create log
    const log = await prisma.log.create({
        data: {
            studentId: student.id,
            date: logDate,
            department: data.department || null,
            clockIn: data.clockIn || null,
            clockOut: data.clockOut || null,
            tasks: data.tasks,
            hours: parseInt(data.hours, 10),
            challenges: data.challenges || null,
            lessons: data.lessons || null,
            status: LOG_STATUS.PENDING,
        },
    });

    const isLate = isLateEntry(data.date);
    logger.info('Log entry created', {
        logId: log.id,
        studentId: student.id,
        date: data.date,
        isLate,
    });

    return { ...log, isLate };
};

const getAllLogs = async (userId, query = {}) => {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundError('Student profile');

    const page = parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(
        parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT,
        PAGINATION.MAX_LIMIT
    );
    const skip = (page - 1) * limit;

    const where = { studentId: student.id };

    // Apply filters
    if (query.status) where.status = query.status;
    if (query.startDate && query.endDate) {
        where.date = {
            gte: new Date(query.startDate),
            lte: new Date(query.endDate),
        };
    }

    const [logs, total] = await prisma.$transaction([
        prisma.log.findMany({
            where,
            orderBy: { date: 'desc' },
            skip,
            take: limit,
        }),
        prisma.log.count({ where }),
    ]);

    // Add isLate flag to each log
    const logsWithFlags = logs.map((log) => ({
        ...log,
        isLate: isLateEntry(log.date),
    }));

    return {
        data: logsWithFlags,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getLogById = async (userId, logId) => {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundError('Student profile');

    const log = await prisma.log.findUnique({ where: { id: logId } });
    if (!log) throw new NotFoundError('Log entry');
    if (log.studentId !== student.id) throw new ForbiddenError();

    return { ...log, isLate: isLateEntry(log.date) };
};

const updateLog = async (userId, logId, data) => {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundError('Student profile');

    const log = await prisma.log.findUnique({ where: { id: logId } });
    if (!log) throw new NotFoundError('Log entry');
    if (log.studentId !== student.id) throw new ForbiddenError();

    // Only pending or rejected logs can be edited
    if (log.status === LOG_STATUS.APPROVED) {
        throw new ImmutableRecordError();
    }

    const updated = await prisma.log.update({
        where: { id: logId },
        data: {
            ...(data.tasks && { tasks: data.tasks }),
            ...(data.hours && { hours: parseInt(data.hours, 10) }),
            ...(data.department !== undefined && { department: data.department || null }),
            ...(data.clockIn !== undefined && { clockIn: data.clockIn || null }),
            ...(data.clockOut !== undefined && { clockOut: data.clockOut || null }),
            ...(data.challenges !== undefined && { challenges: data.challenges || null }),
            ...(data.lessons !== undefined && { lessons: data.lessons || null }),
            // Reset to pending if rejected log is being resubmitted
            ...(log.status === LOG_STATUS.REJECTED && {
                status: LOG_STATUS.PENDING,
                supervisorComment: null,
            }),
        },
    });

    logger.info('Log entry updated', { logId, studentId: student.id });
    return { ...updated, isLate: isLateEntry(updated.date) };
};

const deleteLog = async (userId, logId) => {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundError('Student profile');

    const log = await prisma.log.findUnique({ where: { id: logId } });
    if (!log) throw new NotFoundError('Log entry');
    if (log.studentId !== student.id) throw new ForbiddenError();

    if (log.status === LOG_STATUS.APPROVED) {
        throw new ImmutableRecordError();
    }

    await prisma.log.delete({ where: { id: logId } });
    logger.info('Log entry deleted', { logId, studentId: student.id });
};

module.exports = { createLog, getAllLogs, getLogById, updateLog, deleteLog };
