import { AssetCache } from "@11ty/eleventy-fetch";
import 'dotenv/config'

import globeCal from "./calendarFeed.js";
import slugify from "slugify";
import ical from "node-ical";
import frontMatter from "front-matter";
import striptags from "striptags";
import ent from "ent";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import duration from "dayjs/plugin/duration.js";
import relativeTime from "dayjs/plugin/relativeTime.js";

const localTimezone = "Europe/London";

dayjs
  .extend(utc)
  .extend(timezone)
  .extend(duration)
  .extend(relativeTime)
  .tz.setDefault(localTimezone);

const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH || "1d";

export default async () => {

  if (!process.env.EVENTS_ICAL_FEED) {
    console.error("🚨 Oh no! No iCal in the env…");
    return false;
  }

  let asset = new AssetCache("events");

  if (asset.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("[ 📅 ] Serving events from the cache…");
    return asset.getCachedValue();
  }

  console.log("[ 📅 ] Fetching fresh events…");

  const cal = await globeCal();

  const allEvents = parseEvents(cal);

  asset.save(allEvents, "json");
  console.log(`[ 📅 ] Imported ${allEvents.length} events`);

  return allEvents;
}


function parseEvents(icalRaw) {
  const rangeStart = dayjs().subtract(3, "months");
  const rangeEnd = dayjs().add(4, "months");

  const events = ical.parseICS(icalRaw);
  const returnEvents = [];

  for (let k in events) {
    if (!Object.prototype.hasOwnProperty.call(events, k)) continue;

    const event = events[k];
    if (event.type !== "VEVENT") continue;

    if (!event.rrule) {
      returnEvents.push(eventBuilder(event));
    } else {
      const dates = event.rrule.between(rangeStart.toDate(), rangeEnd.toDate());
      if (dates.length === 0) continue;

      // Loop through each date in the recurrence
      dates.forEach((date) => {
        let curEvent = event;
        let dateLookupKey = date.toISOString().substring(0, 10);
        let showRecurrence = true;

        const startDate = dayjs(date).format("YYYY-MM-DD");
        const startTime = dayjs(curEvent.start).format("HH:mm:ss");
        let start = dayjs(`${startDate} ${startTime}`);

        let duration = dayjs(event.end).valueOf() - curEvent.start.valueOf();
        let end = start.add(duration, "milliseconds");

        // Check to see if there is a reoccurance override
        if (
          curEvent.recurrences != undefined &&
          curEvent.recurrences[dateLookupKey] != undefined
        ) {
          curEvent = curEvent.recurrences[dateLookupKey];
          start = dayjs(curEvent.start);
          duration =
            dayjs(curEvent.end).valueOf() - dayjs(curEvent.start).valueOf();

          // Sometime dates are excluded
        } else if (
          curEvent.exdate != undefined &&
          curEvent.exdate[dateLookupKey] != undefined
        ) {
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

  let eventDesc = striptags(input, ["br"]);
  return eventDesc.replaceAll("<br>", "\r\n");
}

function eventBuilder(event, recurring = false) {
  const start = dayjs(event.start).tz("Etc/UTC");
  const end = dayjs(event.end).tz("Etc/UTC");

  let eventDesc = removeHtmlForParsing(event.description);
  eventDesc = frontMatter(eventDesc);

  const slug = slugify(event.summary, {
    lower: true,
    strict: true,
  });

  let url = `/calendar/${start.format("YYYY-MM-DD")}/${slug}/`;

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
    recurring,
  };
}
