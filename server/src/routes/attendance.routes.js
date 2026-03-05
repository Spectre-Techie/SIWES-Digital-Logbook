const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { handleValidation } = require('../middleware/validate');
const {
    validateMarkAttendance,
    validateAttendanceQuery,
} = require('../validators/attendance.validators');
const attendanceController = require('../controllers/attendance.controller');

router.use(authenticate);
router.use(requireRole('student'));

router.post('/', validateMarkAttendance, handleValidation, attendanceController.mark);
router.get('/', validateAttendanceQuery, handleValidation, attendanceController.getAll);

module.exports = router;
