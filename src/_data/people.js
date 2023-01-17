require("dotenv").config();
const fetch = require("node-fetch");
const { AssetCache } = require("@11ty/eleventy-cache-assets");
const { async } = require("node-ical");
const ENABLE_11TY_CACHE = process.env.ENABLE_11TY_CACHE.toLowerCase() === 'true';
const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH;

if (!process.env.API_BASE) {
  console.error("🚨 Oh no! No API base url in the env…");
  return false;
}

const base = `${process.env.API_BASE}users?per_page=50`;
let thisPage = 1;
let totalPages = 1;

module.exports = () => {
  let wpUsers = new AssetCache("users");

  if (ENABLE_11TY_CACHE && wpUsers.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("👤 Serving users from the cache…");
    return wpUsers.getCachedValue();
  }

  console.log("👤 Fetching users");

  return new Promise(async (resolve, reject) => {
    // Get the first page of users
    let users = await fetchUserPage();

    while (totalPages >= thisPage) {
      t = await fetchUserPage();
      Array.prototype.push.apply(users, t);
    }

    wpUsers.save(users, "json");
    console.log(`✏️  Imported ${users.length} users`);
    resolve(users);
  });
};


async function fetchUserPage() {
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

      res.data.then((authors) => {
        authors.forEach((author) => {
          if (author.profile_photo_url) {
            author.profile_photo_url = author.profile_photo_url.replace('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');
          }
          return author;
        });
        return authors;
      });

      return res.data;
    });
}
