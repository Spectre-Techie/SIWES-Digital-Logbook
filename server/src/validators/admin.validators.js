const { body, param } = require('express-validator');

const validateAssign = [
    body('studentId')
        .isUUID()
        .withMessage('studentId must be a valid UUID'),
    body('supervisorId')
        .isUUID()
        .withMessage('supervisorId must be a valid UUID'),
];

const validateBulkAssign = [
    body('studentIds')
        .isArray({ min: 1 })
        .withMessage('studentIds must be an array with at least one entry'),
    body('studentIds.*')
        .isUUID()
        .withMessage('Each studentId must be a valid UUID'),
    body('supervisorId')
        .isUUID()
        .withMessage('supervisorId must be a valid UUID'),
];

const validateReassign = [
    param('studentId')
        .isUUID()
        .withMessage('studentId param must be a valid UUID'),
    body('newSupervisorId')
        .isUUID()
        .withMessage('newSupervisorId must be a valid UUID'),
];

module.exports = { validateAssign, validateBulkAssign, validateReassign };
