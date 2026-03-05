const statsService = require('../services/stats.service');
const { success } = require('../utils/response');

const getStudentStats = async (req, res, next) => {
    try {
        const stats = await statsService.getStudentStats(req.user.userId);
        success(res, stats);
    } catch (err) {
        next(err);
    }
};

const getSupervisorStats = async (req, res, next) => {
    try {
        const stats = await statsService.getSupervisorStats(req.user.userId);
        success(res, stats);
    } catch (err) {
        next(err);
    }
};

module.exports = { getStudentStats, getSupervisorStats };
