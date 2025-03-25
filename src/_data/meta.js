import 'dotenv/config'
import Fetch from "@11ty/eleventy-fetch";

const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH || "1d";
const additionalsUrl = `${process.env.API_BASE.replace('wp/v2/', 'globe/v1/')}additionals`;

const defaultLocation = "Ark Globe Academy, Harper Road, London, SE1 6AF";
const defaultTime = "4pm";
const defaultTube = "Elephant and Castle";

export default async () => {

  console.log("[ 🐙 ] Fetching meta data");

  const additionals = await Fetch(additionalsUrl, {
    duration: WP_CACHE_LENGTH,
    type: "json"
  });

  const meta = {
    title: "The Globe Church",
    subtitle:
      "All about Jesus. Made up of all sorts of people. Involved in the greatest mission…",
    sundays: sundaysLine(additionals['overrides'] || {}),
    feed: {
      url: "https://www.globe.church/blog/feed.xml",
    },
    url: "https://www.globe.church",

    instagram: additionals['instagram'] || "theglobechurch",
    twitter: additionals['twitter'] || "theglobechurch",
    facebook: "theglobechurch",
    youtube: "theglobechurch",
    linkedin: "theglobechurch",
    email: "info@globe.church",
    registeredAddress: additionals['registeredAddress'] || "GlobeOffice, 83b Mill Lofts, County St, London SE1 4AD",
    overrides: additionals['overrides'] || null,
    service: serviceDetails(additionals['overrides'] || {})
  };

  meta.service.locationName = meta.service.fullAddress.split(',')[0];

  return meta
};

function sundaysLine(overrides) {
  return `
    <p>The Globe Church ${overrides ? 'is meeting this' : 'meets each'} Sunday,
    <strong>${overrides['serviceTime'] || defaultTime}</strong> at
    <strong>${overrides['location'] || defaultLocation}</strong>.</p>
    <p>It's just a few minutes walk from ${overrides['nearestUnderground'] || defaultTube}
    station.</p>`;
}

function serviceDetails(overrides) {
  const details = {
    overrides: !!Object.keys(overrides).length,
    fullAddress: overrides['location'] || defaultLocation,
    time: overrides['serviceTime'] || defaultTime,
    underground: overrides['nearestUnderground'] || defaultTube
  }

  details.locationName = details.fullAddress.split(',')[0];

  return details;
}
