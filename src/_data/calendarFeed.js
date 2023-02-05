require("dotenv").config();
const EleventyFetch = require("@11ty/eleventy-fetch");
const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH || "1d";

if (!process.env.EVENTS_ICAL_FEED) {
  console.error("[ 🚨 ] Oh no! No iCal feed in the env…");
  return false;
}

module.exports = async function() {
  try {
    return EleventyFetch(process.env.EVENTS_ICAL_FEED, {
      duration: WP_CACHE_LENGTH,
      type: "text"
    });
  } catch(e) {
    console.error("[ 🚨 ] Failed to fetch the calendar");
    return false;
  }
};
