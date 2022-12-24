require("dotenv").config();
const fetch = require("node-fetch");
const { AssetCache } = require("@11ty/eleventy-cache-assets");
const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';

if (!process.env.API_BASE) {
  console.error("🚨 Oh no! No API base url in the env…");
  return false;
}

const base = `${process.env.API_BASE}posts?per_page=50`;
let thisPage = 1;
let totalPages = 1;

module.exports = async () => {
  let asset = new AssetCache("posts");

  if (ENABLE_11TY_CACHE && asset.isCacheValid("1d")) {
    console.log("✏️  Serving posts from the cache…");
    return asset.getCachedValue();
  }

  console.log("✏️  Fetching posts");

  return new Promise(async (resolve, reject) => {
    // Get the first round of posts
    let posts = await fetchPosts();

    // Loop through rest of pages…
    while (totalPages >= thisPage) {
      t = await fetchPosts();
      Array.prototype.push.apply(posts, t);
    }

    asset.save(posts, "json");
    console.log(`✏️  Imported ${posts.length} posts`);
    resolve(posts);
  });
};


async function fetchPosts() {
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
      return res.data;
    });
}
