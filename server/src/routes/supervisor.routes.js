const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const supervisorController = require('../controllers/supervisor.controller');

router.use(authenticate);
router.use(requireRole('supervisor'));

// Student management
router.get('/students', supervisorController.getStudents);
router.get('/students/:studentId/logs', supervisorController.getStudentLogs);

// Approval workflow
router.put('/logs/:logId/approve', supervisorController.approveLog);
router.put('/logs/:logId/reject', supervisorController.rejectLog);
router.post('/logs/bulk-approve', supervisorController.bulkApprove);

module.exports = router;
