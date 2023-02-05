require("dotenv").config();
const fetch = require("node-fetch");
const { AssetCache } = require("@11ty/eleventy-fetch");
const ent = require('ent');
const striptags = require('striptags');
const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';
const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH || "1d";

if (!process.env.API_BASE) {
  console.error("🚨 Oh no! No API base url in the env…");
  return false;
}

const base = `${process.env.API_BASE}posts?per_page=50`;
let thisPage = 1;
let totalPages = 1;

module.exports = async () => {
  let asset = new AssetCache("posts");

  if (ENABLE_11TY_CACHE && asset.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("[ 📝 ] Serving posts from the cache…");
    return asset.getCachedValue();
  }

  console.log("[ 📝 ] Fetching posts");

  return new Promise(async (resolve, reject) => {
    // Get the first round of posts
    let posts = await fetchPosts();

    // Loop through rest of pages…
    while (totalPages >= thisPage) {
      t = await fetchPosts();
      Array.prototype.push.apply(posts, t);
    }

    asset.save(posts, "json");
    console.log(`[ 📝 ] Imported ${posts.length} posts`);
    resolve(posts);
  });
};


async function fetchPosts() {
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
      res.data.then((posts) => {
        posts.forEach((post) => {
          post.title = ent.decode(post.title.rendered);
          post.description = striptags(ent.decode(post.excerpt.rendered));
          if (post.featured_img_url) {
            post.featured_img_url = post.featured_img_url.replace('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');
          }
          return post;
        });
        return posts;
      });

      // Clean up the titles; replace HTML entities with actual things
      // Match up the author info

      return res.data;
    });
}
