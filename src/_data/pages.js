require("dotenv").config();
const fetch = require("node-fetch");
const { AssetCache } = require("@11ty/eleventy-cache-assets");
const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';
const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH;
const ent = require('ent');
const striptags = require('striptags');

if (!process.env.API_BASE) {
  console.error("🚨 Oh no! No API base url in the env…");
  return false;
}

const base = `${process.env.API_BASE}pages?per_page=50`;
let thisPage = 1;
let totalPages = 1;

module.exports = () => {
  let wpPages = new AssetCache("pages");

  if (ENABLE_11TY_CACHE && wpPages.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("📃 Serving pages from the cache…");
    return wpPages.getCachedValue();
  }

  console.log("📃 Fetching pages");

  return new Promise(async (resolve, reject) => {
    let pages = await fetchPages();

    // Loop through rest of pages…
    while (totalPages >= thisPage) {
      t = await fetchPages();
      Array.prototype.push.apply(pages, t);
    }

    wpPages.save(pages, "json");
    console.log(`✏️  Imported ${pages.length} pages`);
    resolve(pages);
  });
};

function fetchPages() {
  const url = `${base}&page=${thisPage}`;
  return fetch(url)
    .then((res) => {
      return {
        statusCode: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        data: res.json()
      };
    })
    .then((res) => {
      totalPages = res.headers['x-wp-totalpages'];
      thisPage++;

      // Loop through each of the responses
      res.data.then((allPages) => {
        allPages.forEach((page) => {
          // Replace all the HTML entities that Wordpress throws into the title…
          page.title = ent.decode(page.title.rendered);
          page.description = striptags(ent.decode(page.excerpt.rendered));

          if (page.parent !== 0) {
            page.url = `${parentSlug(allPages, page.parent)}/${page.slug}`;
          } else {
            page.url = page.slug
          }

          if (page.featured_img_url) {
            page.featured_img_url = page.featured_img_url.replace('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');
          }

          page.body = page.content.rendered.replaceAll('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');

          return page;
        });
        return allPages;
      });

      return res.data;
    });
}

// Loop through all the pages to find a parent page
function parentSlug(allPages, parentId) {

  let slug = "";

  const parent = allPages.find(o => o.id === parentId);

  // Find the parent of the parent…
  if (parent.parent) {
    slug += parentSlug(allPages, parent.parent) + "/";
  }

  slug += parent.slug

  return slug;

}


