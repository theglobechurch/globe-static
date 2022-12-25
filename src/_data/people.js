require("dotenv").config();
const fetch = require("node-fetch");
const { AssetCache } = require("@11ty/eleventy-cache-assets");
const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';

if (!process.env.API_BASE) {
  console.error("🚨 Oh no! No API base url in the env…");
  return false;
}

const base = `${process.env.API_BASE}users`;

module.exports = () => {
  let wpUsers = new AssetCache("users");

  if (ENABLE_11TY_CACHE && wpUsers.isCacheValid("1d")) {
    console.log("👤 Serving users from the cache…");
    return wpUsers.getCachedValue();
  }

  console.log("👤 Fetching users");

  return fetch(base)
    .then((res) => res.json())
    .then((authorJson) => {
      wpUsers.save(authorJson, "json");
      return authorJson
    });
};
