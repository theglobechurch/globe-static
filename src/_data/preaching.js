require("dotenv").config();
const fetch = require("node-fetch");
const { AssetCache } = require("@11ty/eleventy-cache-assets");
const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';

if (!process.env.API_BASE) {
  console.error("🚨 Oh no! No API base url in the env…");
  return false;
}

const base = `${process.env.API_BASE}sermons`;

module.exports = () => {
  let wpSermons = new AssetCache("preaching");

  if (ENABLE_11TY_CACHE && wpSermons.isCacheValid("1d")) {
    console.log("🎤 Serving sermons from the cache…");
    return wpSermons.getCachedValue();
  }

  console.log("🎤 Fetching sermons");

  return fetch(base)
    .then((res) => res.json())
    .then((pagesJson) => {

      // pagesJson.forEach(page => {
      //   // Update slug to full URL
      //   page.slug_original = page.slug;
      //   if (page.parent !== 0) {
      //     page.slug = `${parentSlug(pagesJson, page.parent)}/${page.slug}`;
      //   }
      // });

      wpSermons.save(pagesJson, "json");
      return pagesJson
    });
};

