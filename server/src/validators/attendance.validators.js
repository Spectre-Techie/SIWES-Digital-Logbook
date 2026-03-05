const { body, query } = require('express-validator');

const validateMarkAttendance = [
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid ISO date'),

    body('status')
        .notEmpty()
        .withMessage('Attendance status is required')
        .isIn(['present', 'absent', 'excused'])
        .withMessage('Status must be present, absent, or excused'),

    body('checkIn')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Check-in must be in HH:mm format'),

    body('checkOut')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Check-out must be in HH:mm format'),
];

const validateAttendanceQuery = [
    query('month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('Month must be 1-12'),
    query('year')
        .optional()
        .isInt({ min: 2020, max: 2099 })
        .withMessage('Year must be 2020-2099'),
];

module.exports = { validateMarkAttendance, validateAttendanceQuery };
