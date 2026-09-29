import Fetch from "@11ty/eleventy-fetch";
import 'dotenv/config'
import frontMatter from "front-matter";

import { stripEventHtml } from "../_utils/eventDescription.js";

const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH || "1d";

// RFC5545 TEXT values escape backslashes, commas, semicolons and newlines
function unescapeIcsText(value) {
  return value.replace(/\\(n|N|,|;|\\)/g, (_, c) => (c === "n" || c === "N" ? "\n" : c));
}

function escapeIcsText(value) {
  return value.replace(/[\\;,\n]/g, (c) => (c === "\n" ? "\\n" : "\\" + c));
}

// DESCRIPTION values sometimes carry front matter (tags/canonical) and
// HTML meant only for the website's own event pages - strip both before
// they leak into subscribers' calendar apps.
function cleanDescriptionValue(value) {
  const unescaped = unescapeIcsText(value);
  const cleaned = frontMatter(stripEventHtml(unescaped)).body.trim();
  return escapeIcsText(cleaned);
}

// RFC5545 folds long lines with CRLF + a leading space; unfold before
// working with property values so nothing is split mid-value.
function cleanCalendarText(ical) {
  const unfolded = ical.replace(/\r\n[ \t]/g, "");

  const lines = unfolded.split(/\r\n/).map((line) => {
    const match = line.match(/^DESCRIPTION(;[^:]*)?:/);
    if (!match) return line;

    return match[0] + cleanDescriptionValue(line.slice(match[0].length));
  });

  return lines.join("\r\n").replace("Globe Website (PUBLIC)", "The Globe Church Events");
}

export default async () => {

  if (!process.env.EVENTS_ICAL_FEED) {
    console.error("🚨 Oh no! No iCal in the env…");
    return false;
  }

  try {
    const raw = await Fetch(process.env.EVENTS_ICAL_FEED, {
      duration: WP_CACHE_LENGTH,
      type: "text"
    });
    return cleanCalendarText(raw);
  } catch(e) {
    console.error("[ 🚨 ] Failed to fetch the calendar");
    return false;
  }
};
