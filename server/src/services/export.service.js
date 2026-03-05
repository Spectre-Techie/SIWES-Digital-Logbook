const PDFDocument = require('pdfkit');
const { prisma } = require('../config/database');
const { NotFoundError } = require('../utils/errors');
const { format } = require('date-fns');
const logger = require('../utils/logger');

const generatePDF = async (userId, query = {}) => {
    const student = await prisma.student.findUnique({
        where: { userId },
        include: { user: { select: { name: true, email: true } } },
    });
    if (!student) throw new NotFoundError('Student profile');

    const where = { studentId: student.id };
    if (query.status) where.status = query.status;
    if (query.startDate && query.endDate) {
        where.date = { gte: new Date(query.startDate), lte: new Date(query.endDate) };
    }

    const logs = await prisma.log.findMany({
        where,
        orderBy: { date: 'asc' },
    });

    // Build PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('SIWES Training Logbook', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica')
        .text(`Student: ${student.user.name}`, { align: 'center' })
        .text(`Company: ${student.companyName || 'N/A'}`, { align: 'center' })
        .text(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, { align: 'center' });

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#E7E5E4');
    doc.moveDown(1);

    if (logs.length === 0) {
        doc.fontSize(12).text('No log entries found for the selected period.', { align: 'center' });
    } else {
        logs.forEach((log, index) => {
            // Check for new page
            if (doc.y > 680) doc.addPage();

            // Date header
            doc.fontSize(12).font('Helvetica-Bold')
                .fillColor('#059669')
                .text(format(new Date(log.date), 'EEEE, MMMM d, yyyy'));

            // Meta line with clock in/out
            const meta = [];
            if (log.clockIn && log.clockOut) meta.push(`Clock In: ${log.clockIn} | Clock Out: ${log.clockOut}`);
            meta.push(`${log.hours} hours`);
            meta.push(`Status: ${log.status.toUpperCase()}`);
            if (log.department) meta.push(`Dept: ${log.department}`);

            doc.font('Helvetica').fillColor('#78716C').fontSize(9)
                .text(meta.join(' | '));

            doc.moveDown(0.3);

            // Tasks
            doc.fontSize(10).font('Helvetica-Bold').fillColor('#1C1917').text('Tasks:');
            doc.font('Helvetica').fillColor('#44403C').text(log.tasks, { indent: 10 });

            if (log.challenges) {
                doc.moveDown(0.2);
                doc.font('Helvetica-Bold').fillColor('#D97706').text('Challenges:');
                doc.font('Helvetica').fillColor('#44403C').text(log.challenges, { indent: 10 });
            }

            if (log.lessons) {
                doc.moveDown(0.2);
                doc.font('Helvetica-Bold').fillColor('#0D9488').text('Lessons Learned:');
                doc.font('Helvetica').fillColor('#44403C').text(log.lessons, { indent: 10 });
            }

            if (log.supervisorComment) {
                doc.moveDown(0.2);
                doc.font('Helvetica-BoldOblique').fillColor('#7C3AED').text('Supervisor Comment:');
                doc.font('Helvetica-Oblique').fillColor('#44403C').text(log.supervisorComment, { indent: 10 });
            }

            doc.moveDown(0.5);
            if (index < logs.length - 1) {
                doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#E7E5E4');
                doc.moveDown(0.5);
            }
        });

        // Summary footer
        if (doc.y > 620) doc.addPage();
        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#7C3AED');
        doc.moveDown(0.5);

        doc.fontSize(14).font('Helvetica-Bold').fillColor('#1C1917').text('Summary');
        doc.moveDown(0.5);

        const totalHours = logs.reduce((sum, l) => sum + l.hours, 0);
        const approved = logs.filter((l) => l.status === 'approved').length;

        doc.fontSize(10).font('Helvetica').fillColor('#44403C');
        doc.text(`Total entries: ${logs.length}`);
        doc.text(`Total hours: ${totalHours}`);
        doc.text(`Approved: ${approved} | Pending: ${logs.filter(l => l.status === 'pending').length} | Rejected: ${logs.filter(l => l.status === 'rejected').length}`);
        doc.text(`Period: ${format(new Date(logs[0].date), 'MMM d, yyyy')} – ${format(new Date(logs[logs.length - 1].date), 'MMM d, yyyy')}`);
    }

    doc.end();

    logger.info('PDF generated', { studentId: student.id, logCount: logs.length });

    return new Promise((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)));
    });
};

module.exports = { generatePDF };
