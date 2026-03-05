const { prisma } = require('../config/database');
const { NotFoundError } = require('../utils/errors');

// Student stats
const getStudentStats = async (userId) => {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundError('Student profile');

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    // Aggregate all stats in parallel
    const [
        totalLogs,
        pendingLogs,
        approvedLogs,
        rejectedLogs,
        thisMonthLogs,
        totalAttendance,
        presentDays,
        totalHours,
        weeklyLogs,
        recentLogs,
    ] = await prisma.$transaction([
        prisma.log.count({ where: { studentId: student.id } }),
        prisma.log.count({ where: { studentId: student.id, status: 'pending' } }),
        prisma.log.count({ where: { studentId: student.id, status: 'approved' } }),
        prisma.log.count({ where: { studentId: student.id, status: 'rejected' } }),
        prisma.log.count({ where: { studentId: student.id, date: { gte: thisMonth } } }),
        prisma.attendance.count({ where: { studentId: student.id } }),
        prisma.attendance.count({ where: { studentId: student.id, status: 'present' } }),
        prisma.log.aggregate({ where: { studentId: student.id }, _sum: { hours: true } }),
        prisma.log.findMany({
            where: { studentId: student.id, date: { gte: thisWeekStart } },
            orderBy: { date: 'asc' },
            select: { date: true, hours: true, status: true },
        }),
        prisma.log.findMany({
            where: { studentId: student.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { id: true, date: true, tasks: true, status: true, hours: true },
        }),
    ]);

    return {
        overview: {
            totalLogs,
            pendingLogs,
            approvedLogs,
            rejectedLogs,
            thisMonthLogs,
            totalHours: totalHours._sum.hours || 0,
            attendanceRate: totalAttendance > 0 ? Math.round((presentDays / totalAttendance) * 100) : 0,
            totalAttendance,
            presentDays,
        },
        weeklyLogs,
        recentLogs,
    };
};

// Supervisor stats
const getSupervisorStats = async (userId) => {
    const supervisor = await prisma.user.findUnique({ where: { id: userId } });
    if (!supervisor) throw new NotFoundError('Supervisor');

    const [
        totalStudents,
        totalPendingLogs,
        totalApprovedLogs,
        totalRejectedLogs,
        recentPendingLogs,
    ] = await prisma.$transaction([
        prisma.student.count({ where: { supervisorId: userId } }),
        prisma.log.count({
            where: { student: { supervisorId: userId }, status: 'pending' },
        }),
        prisma.log.count({
            where: { student: { supervisorId: userId }, status: 'approved' },
        }),
        prisma.log.count({
            where: { student: { supervisorId: userId }, status: 'rejected' },
        }),
        prisma.log.findMany({
            where: { student: { supervisorId: userId }, status: 'pending' },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                student: {
                    include: { user: { select: { name: true } } },
                },
            },
        }),
    ]);

    return {
        overview: {
            totalStudents,
            totalPendingLogs,
            totalApprovedLogs,
            totalRejectedLogs,
            totalLogs: totalPendingLogs + totalApprovedLogs + totalRejectedLogs,
            approvalRate: (totalApprovedLogs + totalRejectedLogs) > 0
                ? Math.round((totalApprovedLogs / (totalApprovedLogs + totalRejectedLogs)) * 100) : 0,
        },
        recentPendingLogs: recentPendingLogs.map((l) => ({
            id: l.id,
            date: l.date,
            tasks: l.tasks,
            hours: l.hours,
            studentName: l.student.user.name,
            studentId: l.student.id,
        })),
    };
};

module.exports = { getStudentStats, getSupervisorStats };
