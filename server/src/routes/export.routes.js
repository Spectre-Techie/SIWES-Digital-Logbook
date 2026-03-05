const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { exportLimiter } = require('../middleware/rateLimiter');
const exportController = require('../controllers/export.controller');

router.use(authenticate);
router.use(requireRole('student'));

router.get('/pdf', exportLimiter, exportController.exportPDF);

module.exports = router;
