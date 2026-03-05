const adminService = require('../services/admin.service');
const { success } = require('../utils/response');

const getAllStudents = async (req, res, next) => {
    try {
        const result = await adminService.getAllStudents(req.query);
        success(res, result.data, 200, result.meta);
    } catch (err) {
        next(err);
    }
};

const getAllSupervisors = async (req, res, next) => {
    try {
        const result = await adminService.getAllSupervisors(req.query);
        success(res, result.data, 200, result.meta);
    } catch (err) {
        next(err);
    }
};

const getUnassigned = async (req, res, next) => {
    try {
        const data = await adminService.getUnassignedStudents();
        success(res, data);
    } catch (err) {
        next(err);
    }
};

const assignStudent = async (req, res, next) => {
    try {
        const data = await adminService.assignStudent(req.body.studentId, req.body.supervisorId);
        success(res, data);
    } catch (err) {
        next(err);
    }
};

const bulkAssign = async (req, res, next) => {
    try {
        const data = await adminService.bulkAssign(req.body.studentIds, req.body.supervisorId);
        success(res, data);
    } catch (err) {
        next(err);
    }
};

const reassignStudent = async (req, res, next) => {
    try {
        const data = await adminService.reassignStudent(req.params.studentId, req.body.newSupervisorId);
        success(res, data);
    } catch (err) {
        next(err);
    }
};

const getAdminStats = async (req, res, next) => {
    try {
        const data = await adminService.getAdminStats();
        success(res, data);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllStudents,
    getAllSupervisors,
    getUnassigned,
    assignStudent,
    bulkAssign,
    reassignStudent,
    getAdminStats,
};
