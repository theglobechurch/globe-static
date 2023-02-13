const dayjs = require("dayjs");
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const localTimezone = "Europe/London";
const ent = require('ent');

dayjs
  .extend(isSameOrBefore)
  .extend(isSameOrAfter)
  .extend(advancedFormat)
  .extend(utc)
  .extend(timezone)
  .tz.setDefault(localTimezone);

module.exports = {
  formatDate: (dateStr, format = 'YYYY-MM-DD') => {
    if (!dateStr) { return; }

    const parsedDate = dayjs(dateStr);

    if (!parsedDate.isValid()){
      return;
    }

    return parsedDate.format(format);
  },

  jsDate: (dateStr) => {
    if (!dateStr) { return; }
    return dayjs(dateStr).toDate();
  },

  eventThisWeek: (events) => {
    const today = dayjs();
    return events.filter(event => {
      return dayjs(event.startDate).isSameOrAfter(today, "day") && dayjs(event.endDate).isSameOrBefore(today.add(7, 'day'), "day");
    });
  },

  eventsFuture: (events, offset = 0, offsetUnit = 'day') => {
    startDate = dayjs().add(offset, offsetUnit);
    return events.filter(event => {
      return dayjs(event.endDate).isSameOrAfter(startDate, "day");
    })
  },

  eventsFeatured: (events) => {
    return events.filter(event => {
      return event.data.tags && event.data.tags.includes('featured');
    });
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
  },

  // TODO: When 11ty 2.0 released
  // https://www.11ty.dev/docs/filters/#asynchronous-universal-filters
  authorLookup: (authorId, allAuthors) => {
    return allAuthors.find((author) => parseInt(author.id) === parseInt(authorId))
  },

  augmentedPageCheck: (pages, slug) => {
    return pages.find((page) => page.filePathStem.replace('/augmentedPages/', '') === slug)
  },

  limit: (arr, count = 5) => {
    return arr.slice(0, count);
  },

  pageParent: (currentPage, allPages) => {
    if (currentPage.parent === 0) {
      return null;
    }

    return allPages.find((page) => page.id === currentPage.parent);
  },

  pageChildren: (currentPage, allPages) => {
    return allPages.filter((page) => currentPage.id === page.parent)
  },

  sermonsInSeries: (series, allSermons) => {
    return allSermons.filter((sermon) => sermon.sermon_series.includes(series.id))
  },

  seriesLookup: (seriesId, allSeries) => {
    return allSeries.find((series) => series.id === seriesId);
  },

  entEncode: (str) => {
    return ent.encode(str);
  }
}
