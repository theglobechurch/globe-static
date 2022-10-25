const dayjs = require("dayjs");

module.exports = {
  formatDate: (dateObj, format = 'YYYY-MM-DD') => {
    return dayjs(dateObj).format(format);
  },
}
