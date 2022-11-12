const { DateTime } = require("luxon");

module.exports = function () {
  const currentTime = DateTime.local();
  const currentTimeHuman = currentTime.toFormat("dd MMMM yyyy");
  const buildTime = currentTime.valueOf();

  return {
    url: 'https://next.globe.church',
    buildRef: buildTime,
    updatedTime: currentTimeHuman,
    currentYear: new Date().getFullYear(),
    env: process.env.ELEVENTY_ENV
  };
};
