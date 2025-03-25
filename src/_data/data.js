import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js'

const localTimezone = "Europe/London";

dayjs
  .extend(utc)
  .tz.setDefault(localTimezone);

export default () => {
  const currentTime = dayjs.utc().local().format();
  const currentTimeHuman = dayjs().format("dd MMMM yyyy");
  const buildTime = currentTime.valueOf();

  return {
    url: 'https://globe.church',
    timestamp: buildTime,
    updatedTime: currentTimeHuman,
    currentYear: dayjs().format('YYYY'),
    env: process.env.ELEVENTY_ENV
  };
};
