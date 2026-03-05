const authService = require('../services/auth.service');
const { success, created } = require('../utils/response');

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        created(res, result);
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        success(res, result);
    } catch (err) {
        next(err);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user.userId);
        success(res, user);
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, getMe };
