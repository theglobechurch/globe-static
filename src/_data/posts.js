require("dotenv").config();
const fetch = require("node-fetch");
const { AssetCache } = require("@11ty/eleventy-cache-assets");
const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';

if (!process.env.API_BASE) {
  console.error("🚨 Oh no! No API base url in the env…");
  return false;
}

const base = `${process.env.API_BASE}posts`;

module.exports = () => {
  let asset = new AssetCache("posts");

  if (ENABLE_11TY_CACHE && asset.isCacheValid("1d")) {
    console.log("Serving posts from the cache…");
    return asset.getCachedValue();
  }

  console.log("Fetching posts…");

  return fetch(base)
    .then((res) => res.json())
    .then((json) => {
      asset.save(json, "json");
      return json
    });
};
