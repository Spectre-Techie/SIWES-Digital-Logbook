const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const statsController = require('../controllers/stats.controller');

router.use(authenticate);

router.get('/student', statsController.getStudentStats);
router.get('/supervisor', statsController.getSupervisorStats);

module.exports = router;
