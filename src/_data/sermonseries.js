require("dotenv").config();
const fetch = require("node-fetch");
const { AssetCache } = require("@11ty/eleventy-fetch");
const ent = require('ent');

const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';
const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH || "1d";

if (!process.env.API_BASE) {
  console.error("🚨 Oh no! No API base url in the env…");
  return false;
}

const base = `${process.env.API_BASE}sermon_series?per_page=50`;
let thisPage = 1;
let totalPages = 1;

module.exports = () => {
  let wpSeries = new AssetCache("sermonsseries");

  if (ENABLE_11TY_CACHE && wpSeries.isCacheValid(WP_CACHE_LENGTH)) {
    console.log(`[ 🖌️  ] Serving sermon series from the cache…`);
    return wpSeries.getCachedValue();
  }

  console.log("[ 🖌️  ] Fetching sermon series");

  return new Promise(async (resolve, reject) => {
    let series = await fetchSermonSeries();

    // Loop through rest of pages…
    while (totalPages >= thisPage) {
      t = await fetchSermonSeries();
      Array.prototype.push.apply(series, t);
    }

    wpSeries.save(series, "json");
    console.log(`[ 🖌️  ] Imported ${series.length} series`);
    resolve(series);
  })

};

async function fetchSermonSeries() {
  const url = `${base}&page=${thisPage}`;
  const headers = new fetch.Headers();

  if (process.env.CMS_AUTH_USR) {
    const auth = Buffer.from(`${process.env.CMS_AUTH_USR}:${process.env.CMS_AUTH_PWD}`).toString('base64');
    headers.set('Authorization', `Basic ${auth}`)
  }

  return fetch(url, {
    method: 'GET',
    headers,
  })
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
      res.data.then((data) => {
        data.forEach((s) => {

          // Replace all the HTML entities that Wordpress throws into the title…
          s.title = ent.decode(s.name);

          if (s.artwork_url) {
            s.artwork_url = s.artwork_url.replace('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');
          }

          // Remove the WP link meta from internal array
          delete s._links;

          return s;
        });
        return data;
      });

      return res.data;
    });
}
