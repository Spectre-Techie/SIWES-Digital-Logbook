const { body } = require('express-validator');

const validateRegister = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one digit'),

    body('role')
        .isIn(['student', 'supervisor', 'faculty_admin'])
        .withMessage('Role must be student, supervisor, or faculty_admin'),

    body('matricNo')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Matric number cannot exceed 20 characters'),

    body('phone')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Phone number cannot exceed 20 characters'),

    body('companyName')
        .if(body('role').equals('student'))
        .notEmpty()
        .withMessage('Company name is required for students')
        .isLength({ max: 150 })
        .withMessage('Company name cannot exceed 150 characters'),

    body('companyAddress')
        .optional()
        .trim(),

    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Department cannot exceed 100 characters'),

    body('courseOfStudy')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Course of study cannot exceed 100 characters'),

    body('yearOfStudy')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Year of study cannot exceed 20 characters'),

    body('permanentAddress')
        .optional()
        .trim(),

    body('parentPhone')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Parent phone cannot exceed 20 characters'),

    body('industrySupervisorName')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Industry supervisor name cannot exceed 100 characters'),

    body('industrySupervisorPhone')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Industry supervisor phone cannot exceed 20 characters'),
];

const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

module.exports = { validateRegister, validateLogin };
