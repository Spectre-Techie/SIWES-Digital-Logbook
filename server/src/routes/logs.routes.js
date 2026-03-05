const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { handleValidation } = require('../middleware/validate');
const {
    validateCreateLog,
    validateUpdateLog,
    validateLogId,
    validateLogQuery,
} = require('../validators/logs.validators');
const logsController = require('../controllers/logs.controller');

router.use(authenticate);
router.use(requireRole('student'));

router.get('/', validateLogQuery, handleValidation, logsController.getAll);
router.post('/', validateCreateLog, handleValidation, logsController.create);
router.get('/:id', validateLogId, handleValidation, logsController.getById);
router.put('/:id', validateUpdateLog, handleValidation, logsController.update);
router.delete('/:id', validateLogId, handleValidation, logsController.remove);

module.exports = router;
