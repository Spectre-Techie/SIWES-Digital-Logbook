const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin } = require('../validators/auth.validators');
const { handleValidation } = require('../middleware/validate');
const authController = require('../controllers/auth.controller');

router.post('/register', authLimiter, validateRegister, handleValidation, authController.register);
router.post('/login', authLimiter, validateLogin, handleValidation, authController.login);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
