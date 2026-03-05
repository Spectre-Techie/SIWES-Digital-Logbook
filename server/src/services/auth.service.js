const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_ROUNDS } = require('../config/env');
const {
    ConflictError,
    UnauthorizedError,
    NotFoundError,
} = require('../utils/errors');
const logger = require('../utils/logger');

const register = async ({ name, email, password, role, matricNo, phone, companyName, companyAddress, department, courseOfStudy, yearOfStudy, permanentAddress, parentPhone, industrySupervisorName, industrySupervisorPhone }) => {
    // 1. Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictError('An account with this email already exists');

    // 2. Check duplicate matric number (students only)
    if (matricNo) {
        const existingMatric = await prisma.user.findUnique({ where: { matricNo } });
        if (existingMatric) throw new ConflictError('This matric number is already registered');
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // 4. Create user + student profile atomically (no auto-assign — faculty admin assigns supervisors)
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            matricNo: matricNo || null,
            phone: phone || null,
            ...(role === 'student' && {
                student: {
                    create: {
                        companyName,
                        companyAddress: companyAddress || null,
                        department: department || null,
                        courseOfStudy: courseOfStudy || null,
                        yearOfStudy: yearOfStudy || null,
                        permanentAddress: permanentAddress || null,
                        parentPhone: parentPhone || null,
                        industrySupervisorName: industrySupervisorName || null,
                        industrySupervisorPhone: industrySupervisorPhone || null,
                        // supervisorId left null — faculty admin will assign
                    },
                },
            }),
        },
        include: { student: true },
    });

    const token = signToken({ userId: user.id, role: user.role });

    logger.info('User registered', { userId: user.id, role: user.role, email: user.email });

    return {
        user: sanitiseUser(user),
        token,
    };
};

const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            student: {
                include: {
                    supervisor: { select: { id: true, name: true, email: true } },
                },
            },
        },
    });

    if (!user) throw new UnauthorizedError('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

    const token = signToken({ userId: user.id, role: user.role });

    logger.info('User logged in', { userId: user.id, role: user.role });

    return {
        user: sanitiseUser(user),
        token,
    };
};

const getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            student: {
                include: {
                    supervisor: { select: { id: true, name: true, email: true } },
                },
            },
        },
    });
    if (!user) throw new NotFoundError('User');
    return sanitiseUser(user);
};

// -- Helpers --

const signToken = (payload) =>
    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const sanitiseUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    matricNo: user.matricNo,
    phone: user.phone,
    student: user.student
        ? {
            id: user.student.id,
            institution: user.student.institution,
            courseOfStudy: user.student.courseOfStudy,
            yearOfStudy: user.student.yearOfStudy,
            companyName: user.student.companyName,
            companyAddress: user.student.companyAddress,
            department: user.student.department,
            permanentAddress: user.student.permanentAddress,
            parentPhone: user.student.parentPhone,
            industrySupervisorName: user.student.industrySupervisorName,
            industrySupervisorPhone: user.student.industrySupervisorPhone,
            supervisorId: user.student.supervisorId,
            supervisor: user.student.supervisor || null,
        }
        : null,
    createdAt: user.createdAt,
});

module.exports = { register, login, getMe };
