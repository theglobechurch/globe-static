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

  let asset = new AssetCache("pages");

  if (asset.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("[ 📄 ] Serving pages from the cache…");
    return asset.getCachedValue();
  }

  console.log("[ 📄 ] Fetching fresh pages…");

  const allPages = await wpPaginator(`${process.env.API_BASE}pages?per_page=50`);

  allPages.forEach((page) => {
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

    // Make sure all assets are served from assets.
    page.body = page.content.rendered.replaceAll('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');

    // Make sure any CMS URL is wiped out
    page.body = page.content.rendered.replaceAll('https://tgc-cms.globe.church/', '/');
  });

  await asset.save(allPages, "json");

  console.log(`[ 📄 ] Imported ${allPages.length} pages`);

  return allPages;
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


