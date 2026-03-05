const { prisma } = require('../config/database');
const { ForbiddenError, NotFoundError } = require('../utils/errors');

const requireLogOwnership = async (req, res, next) => {
    if (req.user.role === 'supervisor') return next();

    const log = await prisma.log.findUnique({
        where: { id: req.params.id },
        include: { student: { select: { userId: true } } },
    });

    if (!log) return next(new NotFoundError('Log'));
    if (log.student.userId !== req.user.userId) {
        return next(new ForbiddenError());
    }

    req.log = log;
    next();
};

module.exports = { requireLogOwnership };
