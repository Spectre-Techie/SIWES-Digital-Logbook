const logsService = require('../services/logs.service');
const { success, created } = require('../utils/response');

const create = async (req, res, next) => {
    try {
        const log = await logsService.createLog(req.user.userId, req.body);
        created(res, log);
    } catch (err) {
        next(err);
    }
};

const getAll = async (req, res, next) => {
    try {
        const result = await logsService.getAllLogs(req.user.userId, req.query);
        success(res, result.data, 200, result.meta);
    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const log = await logsService.getLogById(req.user.userId, req.params.id);
        success(res, log);
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const log = await logsService.updateLog(req.user.userId, req.params.id, req.body);
        success(res, log);
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        await logsService.deleteLog(req.user.userId, req.params.id);
        success(res, null, 200);
    } catch (err) {
        next(err);
    }
};

module.exports = { create, getAll, getById, update, remove };
