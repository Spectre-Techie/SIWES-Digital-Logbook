const { ForbiddenError } = require('../utils/errors');

const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) return next(new ForbiddenError());
    if (!roles.includes(req.user.role)) {
        return next(new ForbiddenError(`Access restricted to: ${roles.join(', ')}`));
    }
    next();
};

module.exports = { requireRole };
