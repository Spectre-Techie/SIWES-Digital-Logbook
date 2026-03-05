const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('Password123', 10);

    // Clean up old demo data first (order matters due to FK constraints)
    await prisma.attendance.deleteMany({});
    await prisma.log.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('Cleaned old demo data');

    // Create faculty admin
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@demo.com' },
        update: {},
        create: {
            name: 'Faculty Admin',
            email: 'admin@demo.com',
            password: passwordHash,
            role: 'faculty_admin',
            phone: '08012345678',
        },
    });

    console.log('Created faculty admin:', adminUser.email);

    // Create supervisor
    const supervisorUser = await prisma.user.upsert({
        where: { email: 'supervisor@demo.com' },
        update: {},
        create: {
            name: 'Engr. Fatima Abdullahi',
            email: 'supervisor@demo.com',
            password: passwordHash,
            role: 'supervisor',
        },
    });

    console.log('Created supervisor:', supervisorUser.email);

    // Create students
    const student1 = await prisma.user.upsert({
        where: { email: 'imran@demo.com' },
        update: {},
        create: {
            name: 'Imran Bulbula',
            email: 'imran@demo.com',
            password: passwordHash,
            role: 'student',
            matricNo: 'CSC/2023/001',
            phone: '08098765432',
            student: {
                create: {
                    supervisorId: supervisorUser.id,
                    companyName: 'PayStack Technologies',
                    companyAddress: '126 Joel Ogunnaike St, Ikeja GRA, Lagos',
                    department: 'Engineering',
                    institution: 'Northwest University, Kano',
                    courseOfStudy: 'Computer Science',
                    yearOfStudy: '4',
                },
            },
        },
        include: { student: true },
    });

    const student2 = await prisma.user.upsert({
        where: { email: 'chinelo@demo.com' },
        update: {},
        create: {
            name: 'Chinelo Okafor',
            email: 'chinelo@demo.com',
            password: passwordHash,
            role: 'student',
            matricNo: 'CSC/2023/002',
            phone: '08011112222',
            student: {
                create: {
                    supervisorId: supervisorUser.id,
                    companyName: 'Flutterwave Inc',
                    companyAddress: '114 Adeola Odeku St, Lagos',
                    department: 'Product Design',
                    institution: 'Northwest University, Kano',
                    courseOfStudy: 'Software Engineering',
                    yearOfStudy: '3',
                },
            },
        },
        include: { student: true },
    });

    // Student 3 — not assigned (for admin to assign)
    const student3 = await prisma.user.upsert({
        where: { email: 'emeka@demo.com' },
        update: {},
        create: {
            name: 'Emeka Nwosu',
            email: 'emeka@demo.com',
            password: passwordHash,
            role: 'student',
            matricNo: 'CSC/2023/003',
            student: {
                create: {
                    companyName: 'Interswitch Group',
                    companyAddress: '1648c Oko-Awo Close, Victoria Island, Lagos',
                    department: 'Data Analytics',
                    institution: 'Northwest University, Kano',
                    courseOfStudy: 'Cyber Security',
                    yearOfStudy: '4',
                },
            },
        },
        include: { student: true },
    });

    console.log('Created students:', student1.email, student2.email, student3.email);

    // Create sample logs for student1
    const today = new Date();
    const sampleTasks = [
        'Implemented REST API endpoints for the payment module. Reviewed PR from team lead. Updated API documentation.',
        'Built user authentication module with JWT tokens. Wrote unit tests for login and registration endpoints.',
        'Designed database schema for the notification system. Created ER diagrams and reviewed with supervisor.',
        'Integrated third-party payment gateway API. Handled webhook callbacks and error scenarios.',
        'Refactored frontend components for better code reuse. Implemented lazy loading for dashboard widgets.',
    ];

    const sampleChallenges = [
        'Faced issues with async error handling in Express middleware.',
        'Had difficulty configuring CORS for the staging environment.',
        'Struggled with recursive query optimization in PostgreSQL.',
        'Payment gateway sandbox returned inconsistent test data.',
        'CSS grid layout was breaking on mobile viewports below 360px.',
    ];

    const sampleLessons = [
        'Learned proper use of next(error) pattern in Express.',
        'Learned about proper CORS configuration and security headers.',
        'Discovered EXPLAIN ANALYZE and query planning tools.',
        'Importance of idempotency keys for payment processing.',
        'Mobile-first CSS approach prevents most responsive issues.',
    ];

    let logIndex = 0;
    for (let i = 6; i >= 0; i--) {
        const logDate = new Date(today);
        logDate.setDate(today.getDate() - i);
        // Skip weekends
        if (logDate.getDay() === 0 || logDate.getDay() === 6) continue;

        const taskIdx = logIndex % sampleTasks.length;

        await prisma.log.upsert({
            where: {
                unique_student_log_per_day: {
                    studentId: student1.student.id,
                    date: new Date(logDate.toISOString().split('T')[0]),
                },
            },
            update: {},
            create: {
                studentId: student1.student.id,
                date: new Date(logDate.toISOString().split('T')[0]),
                department: 'Software Engineering',
                tasks: sampleTasks[taskIdx],
                hours: 6 + Math.floor(Math.random() * 3),
                challenges: sampleChallenges[taskIdx],
                lessons: sampleLessons[taskIdx],
                clockIn: '08:00',
                clockOut: `${14 + Math.floor(Math.random() * 3)}:00`,
                status: i > 2 ? 'approved' : 'pending',
                supervisorComment: i > 2 ? 'Good detailed entry. Keep it up.' : null,
                approvedAt: i > 2 ? new Date() : null,
            },
        });

        // Also create attendance for that day
        await prisma.attendance.upsert({
            where: {
                unique_student_attendance_per_day: {
                    studentId: student1.student.id,
                    date: new Date(logDate.toISOString().split('T')[0]),
                },
            },
            update: {},
            create: {
                studentId: student1.student.id,
                date: new Date(logDate.toISOString().split('T')[0]),
                status: 'present',
                approved: i > 2,
            },
        });

        logIndex++;
    }

    console.log('Created sample logs and attendance records');
    console.log('Seed complete');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
