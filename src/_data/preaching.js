require("dotenv").config();
const fetch = require("node-fetch");
const { AssetCache } = require("@11ty/eleventy-cache-assets");
const ent = require('ent');

const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';

if (!process.env.API_BASE) {
  console.error("🚨 Oh no! No API base url in the env…");
  return false;
}

const base = `${process.env.API_BASE}sermons?per_page=50`;
let thisPage = 1;
let totalPages = 1;

module.exports = () => {
  let wpSermons = new AssetCache("preaching");

  if (ENABLE_11TY_CACHE && wpSermons.isCacheValid("1d")) {
    console.log(`🎤 Serving sermons from the cache…`);
    return wpSermons.getCachedValue();
  }

  console.log("🎤 Fetching sermons");

  return new Promise(async (resolve, reject) => {
    let sermons = await fetchSermons();

    // Loop through rest of pages…
    while (totalPages >= thisPage) {
      t = await fetchSermons();
      Array.prototype.push.apply(sermons, t);
    }

    wpSermons.save(sermons, "json");
    console.log(`✏️  Imported ${sermons.length} sermons`);
    resolve(sermons);
  })

};

async function fetchSermons() {
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
      res.data.then((sermons) => {
        sermons.forEach((sermon) => {

          // Replace all the HTML entities that Wordpress throws into the title…
          sermon.title = ent.decode(sermon.title.rendered);
          sermon.content = ent.decode(sermon.content.rendered);
          sermon.description = sermon.content;

          if (sermon.sermon_url) {
            sermon.sermon_url = sermon.sermon_url.replace('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');
          }
          return sermon;
        });
        return sermons;
      });

      return res.data;
    });
}
