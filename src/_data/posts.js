import { AssetCache } from "@11ty/eleventy-fetch";
import 'dotenv/config'
import ent from 'ent';
import striptags from 'striptags';
import { wpPaginator } from '../_utils/wp.paginator.js';

const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH || "1d";

export default async () => {

  if (!process.env.API_BASE) {
    console.error("🚨 Oh no! No API base url in the env…");
    return [];
  }

  let asset = new AssetCache("posts");

  if (asset.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("[ 📝 ] Serving posts from the cache…");
    return asset.getCachedValue();
  }

  console.log("[ 📝 ] Fetching fresh posts…");

  const allPosts = await wpPaginator(`${process.env.API_BASE}posts?per_page=50`);

  allPosts.forEach((post) => {
    post.title = ent.decode(post.title.rendered);
    post.description = striptags(ent.decode(post.excerpt.rendered));
    if (post.featured_img_url) {
      post.featured_img_url = post.featured_img_url.replace('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');
    }
    return post;
  });

  await asset.save(allPosts, "json");

  console.log(`[ 📻 ] Imported ${allPosts.length} blog posts`);

  return allPosts;
};
