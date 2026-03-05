const attendanceService = require('../services/attendance.service');
const { success, created } = require('../utils/response');

const mark = async (req, res, next) => {
    try {
        const attendance = await attendanceService.markAttendance(req.user.userId, req.body);
        created(res, attendance);
    } catch (err) {
        next(err);
    }
};

const getAll = async (req, res, next) => {
    try {
        const result = await attendanceService.getAttendance(req.user.userId, req.query);
        success(res, result);
    } catch (err) {
        next(err);
    }
};

module.exports = { mark, getAll };
