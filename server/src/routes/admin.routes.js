const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { handleValidation } = require('../middleware/validate');
const { validateAssign, validateBulkAssign, validateReassign } = require('../validators/admin.validators');
const adminController = require('../controllers/admin.controller');

router.use(authenticate);
router.use(requireRole('faculty_admin'));

// Overview
router.get('/stats', adminController.getAdminStats);

// Students
router.get('/students', adminController.getAllStudents);
router.get('/unassigned', adminController.getUnassigned);

// Supervisors
router.get('/supervisors', adminController.getAllSupervisors);

// Assignment
router.post('/assign', validateAssign, handleValidation, adminController.assignStudent);
router.post('/bulk-assign', validateBulkAssign, handleValidation, adminController.bulkAssign);
router.put('/reassign/:studentId', validateReassign, handleValidation, adminController.reassignStudent);

module.exports = router;
