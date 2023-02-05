require("dotenv").config();
const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH;


if (!process.env.EVENTS_ICAL_FEED) {
  console.error("🚨 Oh no! No iCal feed in the env…");
  return false;
}

const { AssetCache } = require("@11ty/eleventy-fetch");
const slugify = require("slugify");
const fetch = require("node-fetch");
const ical = require('node-ical');
const frontMatter = require('front-matter');
const striptags = require('striptags');
const ent = require('ent');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const duration = require('dayjs/plugin/duration');
const relativeTime = require('dayjs/plugin/relativeTime');
const localTimezone = "Europe/London";

dayjs
  .extend(utc)
  .extend(timezone)
  .extend(duration)
  .extend(relativeTime)
  .tz.setDefault(localTimezone);

const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';
const icalFeedUrl = process.env.EVENTS_ICAL_FEED;

module.exports = () => {

  let globeEvents = new AssetCache("globeEvents");

  if (ENABLE_11TY_CACHE && globeEvents.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("📅 Serving events from the cache…");
    return globeEvents.getCachedValue();
  }

  console.log("📅 Fetching events");

  return new Promise((resolve, reject) => {
    fetch(icalFeedUrl)
      .then((res) => res.text())
      .then((icalRaw) => {
        // Parse the ical feed
        const allEvents = parseEvents(icalRaw)

        // Save the events to the 11ty cache
        globeEvents.save(allEvents, "json");
        console.log(`📅 Imported ${allEvents.length} events`);

        // Return everything successfully
        resolve(allEvents);
      });
  });
}

function parseEvents(icalRaw) {
  const rangeStart = dayjs().subtract(3, 'months');
  const rangeEnd = dayjs().add(4, 'months');

  const events = ical.parseICS(icalRaw);
  const returnEvents = [];

  for (let k in events) {
    if (!Object.prototype.hasOwnProperty.call(events, k)) continue;

    const event = events[k];
    if (event.type !== 'VEVENT') continue;

    if (!event.rrule) {
      returnEvents.push(eventBuilder(event));
    } else {

      const dates = event.rrule.between(rangeStart.toDate(), rangeEnd.toDate());
      if (dates.length === 0) continue;

      // Loop through each date in the recurrence
      dates.forEach(date => {

        let curEvent = event;
        let dateLookupKey = date.toISOString().substring(0, 10);
        let showRecurrence = true;

        const startDate = dayjs(date).format('YYYY-MM-DD');
        const startTime = dayjs(curEvent.start).format('HH:mm:ss');
        let start = dayjs(`${startDate} ${startTime}`);

        let duration = dayjs(event.end).valueOf() - curEvent.start.valueOf();
        let end = start.add(duration, 'milliseconds');

        // Check to see if there is a reoccurance override
        if ((curEvent.recurrences != undefined) && (curEvent.recurrences[dateLookupKey] != undefined)) {
          curEvent = curEvent.recurrences[dateLookupKey];
          start = dayjs(curEvent.start);
          duration = dayjs(curEvent.end).valueOf() - dayjs(curEvent.start).valueOf();

        // Sometime dates are excluded
        } else if ((curEvent.exdate != undefined) && (curEvent.exdate[dateLookupKey] != undefined)) {
          showRecurrence = false;
        }

        if (showRecurrence) {
          curEvent.start = start.toDate();
          curEvent.end = end.toDate();

          returnEvents.push(eventBuilder(curEvent, true));
        }

      });
    }
  }

  return returnEvents;
}

// Some event descriptions have <html-blob>s
// We need to get rid of that
function removeHtmlForParsing(input) {
  if (input === undefined || input[0] !== "<") {
    return input;
  }

  let eventDesc = striptags(input, ['br']);
  return eventDesc.replaceAll('<br>','\r\n');
}

function eventBuilder(event, recurring = false) {

  start = dayjs(event.start).tz("Etc/UTC");
  end = dayjs(event.end).tz("Etc/UTC");

  let eventDesc = removeHtmlForParsing(event.description);
  eventDesc = frontMatter(eventDesc);

  const slug = slugify(event.summary, {
    lower: true,
    strict: true,
  });

  let url = `/calendar/${start.format('YYYY-MM-DD')}/${slug}/`;

  if (eventDesc.attributes.canonical) {
    url = eventDesc.attributes.canonical;
  }

  const duration = dayjs.duration(end.diff(start)).humanize();

  return {
    title: ent.decode(event.summary),
    slug,
    url,
    location: event.location,
    startDate: start.format(),
    endDate: end.format(),
    duration,
    body: eventDesc.body,
    data: eventDesc.attributes,
    recurring
  }
}
