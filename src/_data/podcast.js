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

const base = `https://wp.test/wp-json/wp/v2/podcast?per_page=50`;
// const base = `${process.env.API_BASE}podcast?per_page=50`;
let thisPage = 1;
let totalPages = 1;

module.exports = () => {
  let wpPodcast = new AssetCache("podcast");

  if (ENABLE_11TY_CACHE && wpPodcast.isCacheValid(WP_CACHE_LENGTH)) {
    console.log(`[ 📻 ] Serving podcast from the cache…`);
    return wpPodcast.getCachedValue();
  }

  console.log("[ 📻 ] Fetching podcast");

  return new Promise(async (resolve, reject) => {
    let podcasts = await fetchPodcastEpisodes();

    // Loop through rest of pages…
    while (totalPages >= thisPage) {
      t = await fetchPodcastEpisodes();
      Array.prototype.push.apply(podcasts, t);
    }

    wpPodcast.save(podcasts, "json");
    console.log(`[ 🎤 ] Imported ${podcasts.length} podcast episodes`);
    resolve(podcasts);
  })

};

async function fetchPodcastEpisodes() {
  const url = `${base}&page=${thisPage}`;
  const headers = new fetch.Headers();

  if (process.env.CMS_AUTH_USR) {
    const auth = Buffer.from(`${process.env.CMS_AUTH_USR}:${process.env.CMS_AUTH_PWD}`).toString('base64');
    headers.set('Authorization', `Basic ${auth}`)
  }

  // TODO REMOVE
  const https = require('https');
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  return fetch(url, {
    method: 'GET',
    headers,
    agent: httpsAgent
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
      res.data.then((episodes) => {
        episodes.forEach((episode) => {

          // Replace all the HTML entities that Wordpress throws into the title…
          episode.title = ent.decode(episode.title.rendered);
          episode.content = ent.decode(episode.content.rendered);
          episode.description = episode.content;

          if (episode.podcast_data.url) {
            episode.podcast_data.url = episode.podcast_data.url.replace('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');
          }
          return episode;
        });
        return episodes;
      });

      return res.data;
    });
}
