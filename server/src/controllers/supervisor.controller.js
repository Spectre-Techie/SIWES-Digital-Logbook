const supervisorService = require('../services/supervisor.service');
const { success } = require('../utils/response');

const getStudents = async (req, res, next) => {
    try {
        const result = await supervisorService.getStudents(req.user.userId, req.query);
        success(res, result.data, 200, result.meta);
    } catch (err) {
        next(err);
    }
};

const getStudentLogs = async (req, res, next) => {
    try {
        const result = await supervisorService.getStudentLogs(
            req.user.userId,
            req.params.studentId,
            req.query
        );
        success(res, result);
    } catch (err) {
        next(err);
    }
};

const approveLog = async (req, res, next) => {
    try {
        const log = await supervisorService.approveLog(
            req.user.userId,
            req.params.logId,
            req.body.comment
        );
        success(res, log);
    } catch (err) {
        next(err);
    }
};

const rejectLog = async (req, res, next) => {
    try {
        const log = await supervisorService.rejectLog(
            req.user.userId,
            req.params.logId,
            req.body.comment
        );
        success(res, log);
    } catch (err) {
        next(err);
    }
};

const bulkApprove = async (req, res, next) => {
    try {
        const result = await supervisorService.bulkApprove(req.user.userId, req.body.logIds);
        success(res, result);
    } catch (err) {
        next(err);
    }
};

module.exports = { getStudents, getStudentLogs, approveLog, rejectLog, bulkApprove };
