import Fetch from "@11ty/eleventy-fetch";
import 'dotenv/config'

const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH || "1d";

export default async () => {

  if (!process.env.EVENTS_ICAL_FEED) {
    console.error("🚨 Oh no! No iCal in the env…");
    return false;
  }

  try {
    return Fetch(process.env.EVENTS_ICAL_FEED, {
      duration: WP_CACHE_LENGTH,
      type: "text"
    });
  } catch(e) {
    console.error("[ 🚨 ] Failed to fetch the calendar");
    return false;
  }
};
