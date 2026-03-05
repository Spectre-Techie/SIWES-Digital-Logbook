const exportService = require('../services/export.service');
const logger = require('../utils/logger');

const exportPDF = async (req, res, next) => {
    try {
        const buffer = await exportService.generatePDF(req.user.userId, req.query);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="siwes-logbook.pdf"',
            'Content-Length': buffer.length,
        });
        res.send(buffer);
    } catch (err) {
        next(err);
    }
};

module.exports = { exportPDF };
