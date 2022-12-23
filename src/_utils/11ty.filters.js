const dayjs = require("dayjs");
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const localTimezone = "Europe/London";

dayjs
  .extend(isSameOrBefore)
  .extend(isSameOrAfter)
  .extend(utc)
  .extend(timezone)
  .tz.setDefault(localTimezone);

module.exports = {
  formatDate: (dateObj, format = 'YYYY-MM-DD') => {
    if (!dateObj) { return; }

    const parsedDate = dayjs(dateObj);

    if (!parsedDate.isValid()){
      return;
    }

    return parsedDate.format(format);
  },

  eventThisWeek: (events) => {
    const today = dayjs();
    return events.filter(event => {
      return dayjs(event.startDate).isSameOrAfter(today, "day") && dayjs(event.endDate).isSameOrBefore(today.add(7, 'day'), "day");
    });
  },

  eventsFuture: (events, offset = 0, offsetUnit = 'days') => {
    startDate = dayjs().add(offset, offsetUnit);
    return events.filter(event => {
      // console.log(startDate, event.endDate)
      return dayjs(event.endDate).isSameOrAfter(startDate, "day");
    })
  },

  eventsSort: (events) => {
    return events.sort((a, b) => {
      if (a.startDate > b.startDate) {
        return 1;
      }
      if (a.startDate < b.startDate) {
        return -1;
      }
      return 0;
    });
  },

  eventsOneOff: (events) => {
    return events.filter(event => {
      return event.recurring === false
    });
  }
}
