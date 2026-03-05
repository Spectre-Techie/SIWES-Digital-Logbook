const { differenceInDays, startOfDay } = require('date-fns');
const { LATE_ENTRY_DAYS } = require('../config/constants');

const isLateEntry = (logDate) => {
    const daysDiff = differenceInDays(new Date(), new Date(logDate));
    return daysDiff > LATE_ENTRY_DAYS;
};

const isFutureDate = (dateStr) => {
    const logDate = startOfDay(new Date(dateStr));
    const today = startOfDay(new Date());
    return logDate > today;
};

module.exports = { isLateEntry, isFutureDate };
