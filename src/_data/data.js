const { DateTime } = require("luxon");

module.exports = function () {
  const currentTime = DateTime.local();
  const currentTimeHuman = currentTime.toFormat("dd MMMM yyyy");
  const buildTime = currentTime.valueOf();

  return {
    url: 'https://globe.church',
    timestamp: buildTime,
    updatedTime: currentTimeHuman,
    currentYear: new Date().getFullYear(),
    env: process.env.ELEVENTY_ENV
  };
};
