require("dotenv").config();
const fetch = require("node-fetch");
const { AssetCache } = require("@11ty/eleventy-cache-assets");
const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';
const ent = require('ent');

if (!process.env.API_BASE) {
  console.error("🚨 Oh no! No API base url in the env…");
  return false;
}

const base = `${process.env.API_BASE}pages?per_page=50`;
let thisPage = 1;
let totalPages = 1;

module.exports = () => {
  let wpPages = new AssetCache("pages");

  if (ENABLE_11TY_CACHE && wpPages.isCacheValid("1d")) {
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

  // return fetch(base)
  //   .then((res) => res.json())
  //   .then((pagesJson) => {

  //     pagesJson.forEach(page => {
  //       // Update slug to full URL
  //       page.slug_original = page.slug;
  //       if (page.parent !== 0) {
  //         page.slug = `${parentSlug(pagesJson, page.parent)}/${page.slug}`;
  //       }
  //     });

  //     wpPages.save(pagesJson, "json");
  //     return pagesJson
  //   });
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

          // Update slug to full URL
          page.slug_original = page.slug;
          if (page.parent !== 0) {
            page.slug = `${parentSlug(allPages, page.parent)}/${page.slug}`;
          }

          return page;
        });
        return allPages;
      });

      return res.data;
    });
}

// Loop through all the pages to find a parent page
function parentSlug(allPages, parentId) {
  const parent = allPages.find(o => o.id === parentId);
  if (parent) {
    return parent.slug
  }
}
