require("dotenv").config();

if (!process.env.EVENTS_ICAL_FEED) {
  console.error("🚨 Oh no! No iCal feed in the env…");
  return false;
}

const fetch = require("node-fetch");
const { AssetCache } = require("@11ty/eleventy-cache-assets");
const ical = require('ical');
const frontMatter = require('front-matter');
const striptags = require('striptags');
// TODO: Switch this for DayJS
const moment = require('moment');

const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';
const icalFeedUrl = process.env.EVENTS_ICAL_FEED;

module.exports = () => {

  let globeEvents = new AssetCache("globeEvents");

  if (ENABLE_11TY_CACHE && globeEvents.isCacheValid("1d")) {
    console.log("📅 Serving events from the cache…");
    return globeEvents.getCachedValue();
  }

  console.log("📅 Fetching events");

  const importedEvents = [];

  // fix me
  const rangeStart = moment("2020-01-01");
  const rangeEnd = moment("2022-12-31");

  return new Promise((resolve, reject) => {

    fetch(icalFeedUrl)
      .then((res) => res.text())
      .then((icalRaw) => {
        const events = ical.parseICS(icalRaw);

        for (let k in events) {

          if (events.hasOwnProperty(k)) {
            var ev = events[k];

            if (events[k].type == 'VEVENT') {

              let startDate = moment(ev.start);
              let endDate = moment(ev.end);

              const duration = parseInt(endDate.format("x")) - parseInt(startDate.format("x"));

              let eventDesc = removeHtmlForParsing(ev.description);
              eventDesc = frontMatter(eventDesc);

              const eventDetails = {
                title: ev.summary,
                location: ev.location,
                startDate: startDate.format(),
                endDate: endDate.format(),
                duration: moment.duration(duration).humanize(),
                body: eventDesc.body,
                data: eventDesc.attributes
              };

              // One off events…
              if (typeof ev.rrule === 'undefined') {
                importedEvents.push(eventDetails);
              } else if (typeof ev.rrule !== 'undefined') {
                const dates = ev.rrule.between(
                  rangeStart.toDate(),
                  rangeEnd.toDate(),
                  true,
                  function(date, i) { return true; }
                );

                if (ev.recurrences !== undefined){
                  for (let r in ev.recurrences) {
                    if (moment(new Date(r)).isBetween(rangeStart, rangeEnd) != true) {
                      dates.push(new Date(r));
                    }
                  }
                }

                for(let i in dates) {
                  var date = dates[i];
                  var curEvent = ev;
                  var showRecurrence = true;
                  var curDuration = duration;

                  startDate = moment(date);

                  // Use just the date of the recurrence to look up overrides and exceptions (i.e. chop off time information)
                  var dateLookupKey = date.toISOString().substring(0, 10);

                  // For each date that we're checking, it's possible that there is a recurrence override for that one day.
                  if ((curEvent.recurrences != undefined) && (curEvent.recurrences[dateLookupKey] != undefined)) {
                    // We found an override, so for this recurrence, use a potentially different title, start date, and duration.
                    curEvent = curEvent.recurrences[dateLookupKey];
                    startDate = moment(curEvent.start);
                    curDuration = parseInt(moment(curEvent.end).format("x")) - parseInt(startDate.format("x"));

                  // If there's no recurrence override, check for an exception date.  Exception dates represent exceptions to the rule.
                  } else if ((curEvent.exdate != undefined) && (curEvent.exdate[dateLookupKey] != undefined)) {
                    // This date is an exception date, which means we should skip it in the recurrence pattern.
                    showRecurrence = false;
                  }

                  // Set the the title and the end date from either the regular event or the recurrence override.
                  var recurrenceTitle = curEvent.summary;

                  endDate = moment(parseInt(startDate.format("x")) + curDuration, 'x');

                  // If this recurrence ends before the start of the date range, or starts after the end of the date range,
                  // don't process it.
                  if (endDate.isBefore(rangeStart) || startDate.isAfter(rangeEnd)) {
                    showRecurrence = false;
                  }

                  if (showRecurrence === true) {

                    let eventDesc = removeHtmlForParsing(curEvent.description);
                    eventDesc = frontMatter(eventDesc);

                    importedEvents.push({
                      title: curEvent.summary,
                      location: curEvent.location,
                      startDate: startDate.format(),
                      endDate: endDate.format(),
                      duration: moment.duration(curDuration).humanize(),
                      body: eventDesc.body,
                      data: eventDesc.attributes
                    });
                  }

                }

              }

            }
          }

        }

        globeEvents.save(importedEvents, "json");
        console.log(`📅 Imported ${importedEvents.length} events`);

        resolve(importedEvents);
      });
  });
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
