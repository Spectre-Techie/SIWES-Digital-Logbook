const { body, param, query } = require('express-validator');

const validateCreateLog = [
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid ISO date'),

    body('tasks')
        .trim()
        .notEmpty()
        .withMessage('Tasks description is required')
        .isLength({ min: 10 })
        .withMessage('Tasks must be at least 10 characters')
        .isLength({ max: 2000 })
        .withMessage('Tasks cannot exceed 2000 characters'),

    body('hours')
        .isInt({ min: 1, max: 12 })
        .withMessage('Hours must be between 1 and 12'),

    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Department cannot exceed 100 characters'),

    body('clockIn')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Clock-in must be in HH:mm format'),

    body('clockOut')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Clock-out must be in HH:mm format'),

    body('challenges')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Challenges cannot exceed 1000 characters'),

    body('lessons')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Lessons cannot exceed 1000 characters'),
];

const validateUpdateLog = [
    param('id').isUUID().withMessage('Invalid log ID'),

    body('tasks')
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage('Tasks must be at least 10 characters')
        .isLength({ max: 2000 })
        .withMessage('Tasks cannot exceed 2000 characters'),

    body('hours')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('Hours must be between 1 and 12'),

    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Department cannot exceed 100 characters'),

    body('clockIn')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Clock-in must be in HH:mm format'),

    body('clockOut')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Clock-out must be in HH:mm format'),

    body('challenges')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Challenges cannot exceed 1000 characters'),

    body('lessons')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Lessons cannot exceed 1000 characters'),
];

const validateLogId = [
    param('id').isUUID().withMessage('Invalid log ID'),
];

const validateLogQuery = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
    query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status filter'),
    query('startDate').optional().isISO8601().withMessage('Invalid start date'),
    query('endDate').optional().isISO8601().withMessage('Invalid end date'),
];

module.exports = { validateCreateLog, validateUpdateLog, validateLogId, validateLogQuery };
