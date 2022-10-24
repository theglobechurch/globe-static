require("dotenv").config();
const fetch = require("node-fetch");
const { AssetCache } = require("@11ty/eleventy-cache-assets");
const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';

if (!process.env.API_BASE) {
  console.error("🚨 Oh no! No API base url in the env…");
  return false;
}

const base = `${process.env.API_BASE}pages`;

module.exports = () => {
  let wpPages = new AssetCache("pages");

  if (ENABLE_11TY_CACHE && wpPages.isCacheValid("1d")) {
    console.log("Serving pages from the cache…");
    return wpPages.getCachedValue();
  }

  console.log("Fetching pages");

  return fetch(base)
    .then((res) => res.json())
    .then((pagesJson) => {

      pagesJson.forEach(page => {
        // Update slug to full URL
        page.slug_original = page.slug;
        if (page.parent !== 0) {
          page.slug = `${parentSlug(pagesJson, page.parent)}/${page.slug}`;
        }
      });

      wpPages.save(pagesJson, "json");
      return pagesJson
    });
};

// Loop through all the pages to find a parent page
function parentSlug(allPages, parentId) {
  const parent = allPages.find(o => o.id === parentId);
  if (parent) {
    return parent.slug
  }
}
