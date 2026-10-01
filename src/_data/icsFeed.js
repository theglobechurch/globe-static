import frontMatter from "front-matter";

import calendarFeed from "./calendarFeed.js";
import { stripEventHtml } from "../_utils/eventDescription.js";

// Cleaned-up iCal feed for public subscribers (ical.njk). calendarFeed.js
// stays untouched raw text, since events.js also parses it to pull out
// per-event front matter (canonical/tags) for the website's own pages.

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
  const raw = await calendarFeed();

  if (!raw) {
    return false;
  }

  return cleanCalendarText(raw);
};
