const { prisma } = require('../config/database');
const { PAGINATION } = require('../config/constants');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const logger = require('../utils/logger');

// Get all students with optional filters
const getAllStudents = async (query = {}) => {
    const page = parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = {};

    // Filter by assignment status
    if (query.assigned === 'true') {
        where.supervisorId = { not: null };
    } else if (query.assigned === 'false') {
        where.supervisorId = null;
    }

    // Search by name, matric, or company
    if (query.search) {
        where.OR = [
            { user: { name: { contains: query.search, mode: 'insensitive' } } },
            { companyName: { contains: query.search, mode: 'insensitive' } },
        ];
    }

    const [students, total] = await prisma.$transaction([
        prisma.student.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true, matricNo: true, phone: true } },
                supervisor: { select: { id: true, name: true, email: true } },
                _count: { select: { logs: true, attendance: true } },
            },
            orderBy: { user: { name: 'asc' } },
            skip,
            take: limit,
        }),
        prisma.student.count({ where }),
    ]);

    const data = students.map((s) => ({
        id: s.id,
        userId: s.user.id,
        name: s.user.name,
        email: s.user.email,
        matricNo: s.user.matricNo,
        phone: s.user.phone,
        companyName: s.companyName,
        companyAddress: s.companyAddress,
        department: s.department,
        courseOfStudy: s.courseOfStudy,
        yearOfStudy: s.yearOfStudy,
        supervisor: s.supervisor ? { id: s.supervisor.id, name: s.supervisor.name } : null,
        totalLogs: s._count.logs,
        totalAttendance: s._count.attendance,
    }));

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

// Get all supervisors with student counts
const getAllSupervisors = async (query = {}) => {
    const page = parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = { role: 'supervisor' };

    if (query.search) {
        where.name = { contains: query.search, mode: 'insensitive' };
    }

    const [supervisors, total] = await prisma.$transaction([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                _count: { select: { supervisedStudents: true } },
            },
            orderBy: { name: 'asc' },
            skip,
            take: limit,
        }),
        prisma.user.count({ where }),
    ]);

    const data = supervisors.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        studentCount: s._count.supervisedStudents,
        createdAt: s.createdAt,
    }));

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

// Get unassigned students
const getUnassignedStudents = async () => {
    const students = await prisma.student.findMany({
        where: { supervisorId: null },
        include: {
            user: { select: { id: true, name: true, email: true, matricNo: true } },
        },
        orderBy: { companyName: 'asc' },
    });

    return students.map((s) => ({
        id: s.id,
        userId: s.user.id,
        name: s.user.name,
        email: s.user.email,
        matricNo: s.user.matricNo,
        companyName: s.companyName,
        companyAddress: s.companyAddress,
        department: s.department,
    }));
};

// Assign a student to a supervisor
const assignStudent = async (studentId, supervisorId) => {
    // Verify supervisor exists and is a supervisor
    const supervisor = await prisma.user.findUnique({ where: { id: supervisorId } });
    if (!supervisor || supervisor.role !== 'supervisor') {
        throw new NotFoundError('Supervisor');
    }

    // Verify student exists
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundError('Student');

    const updated = await prisma.student.update({
        where: { id: studentId },
        data: { supervisorId },
        include: {
            user: { select: { name: true } },
            supervisor: { select: { name: true } },
        },
    });

    logger.info('Student assigned to supervisor', {
        studentId,
        supervisorId,
        studentName: updated.user.name,
        supervisorName: updated.supervisor?.name,
    });

    return {
        studentId: updated.id,
        studentName: updated.user.name,
        supervisorName: updated.supervisor?.name,
    };
};

// Bulk assign students to a supervisor
const bulkAssign = async (studentIds, supervisorId) => {
    // Verify supervisor
    const supervisor = await prisma.user.findUnique({ where: { id: supervisorId } });
    if (!supervisor || supervisor.role !== 'supervisor') {
        throw new NotFoundError('Supervisor');
    }

    // Verify all students exist
    const students = await prisma.student.findMany({
        where: { id: { in: studentIds } },
    });
    if (students.length !== studentIds.length) {
        throw new NotFoundError('One or more students');
    }

    const result = await prisma.student.updateMany({
        where: { id: { in: studentIds } },
        data: { supervisorId },
    });

    logger.info('Bulk student assignment', {
        supervisorId,
        count: result.count,
        supervisorName: supervisor.name,
    });

    return { assigned: result.count, supervisorName: supervisor.name };
};

// Reassign a student to a different supervisor
const reassignStudent = async (studentId, newSupervisorId) => {
    return assignStudent(studentId, newSupervisorId);
};

// Admin overview stats
const getAdminStats = async () => {
    const [
        totalStudents,
        unassignedStudents,
        totalSupervisors,
        totalLogs,
        pendingLogs,
        approvedLogs,
        rejectedLogs,
    ] = await prisma.$transaction([
        prisma.student.count(),
        prisma.student.count({ where: { supervisorId: null } }),
        prisma.user.count({ where: { role: 'supervisor' } }),
        prisma.log.count(),
        prisma.log.count({ where: { status: 'pending' } }),
        prisma.log.count({ where: { status: 'approved' } }),
        prisma.log.count({ where: { status: 'rejected' } }),
    ]);

    return {
        totalStudents,
        unassignedStudents,
        assignedStudents: totalStudents - unassignedStudents,
        totalSupervisors,
        totalLogs,
        pendingLogs,
        approvedLogs,
        rejectedLogs,
        approvalRate: (approvedLogs + rejectedLogs) > 0
            ? Math.round((approvedLogs / (approvedLogs + rejectedLogs)) * 100)
            : 0,
    };
};

module.exports = {
    getAllStudents,
    getAllSupervisors,
    getUnassignedStudents,
    assignStudent,
    bulkAssign,
    reassignStudent,
    getAdminStats,
};
