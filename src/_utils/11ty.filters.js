const dayjs = require("dayjs");
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

module.exports = {
  formatDate: (dateObj, format = 'YYYY-MM-DD') => {
    return dayjs(dateObj).format(format);
  },

  thisWeek: (events) => {
    const today = dayjs();
    return events.filter(event => {
      return dayjs(event.startDate).isSameOrAfter(today, "day") && dayjs(event.endDate).isSameOrBefore(today.add(7, 'day'), "day");
    });
  },

  futureEvents: (events, offset = 0, offsetUnit = 'days') => {
    startDate = dayjs().add(offset, offsetUnit);

    return events.filter(event => {
      return dayjs(event.endDate).isSameOrAfter(startDate, "day");
    })
  },

  sortEvents: (events) => {
    return events.sort((a, b) => {
      if (a.startDate > b.startDate) {
        return 1;
      }
      if (a.startDate < b.startDate) {
        return -1;
      }
      return 0;
    });
  }
}
