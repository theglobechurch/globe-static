import { AssetCache } from "@11ty/eleventy-fetch";
import 'dotenv/config'
import ent from 'ent';
import striptags from 'striptags';
import { wpPaginator } from '../_utils/wp.paginator.js';

const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH || "1d";

const assetUrl = (url) => url
  ? url.replace('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church')
  : null;

export default async () => {

  if (!process.env.API_BASE) {
    console.error("🚨 Oh no! No API base url in the env…");
    return [];
  }

  let asset = new AssetCache("trees");

  if (asset.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("[ 🌳 ] Serving trees from the cache…");
    return asset.getCachedValue();
  }

  console.log("[ 🌳 ] Fetching fresh trees…");

  const allTrees = await wpPaginator(`${process.env.API_BASE}link-trees?per_page=50`);

  // Only keep the fields the templates need
  const trees = allTrees.map((tree) => ({
    title: ent.decode(tree.title.rendered),
    slug: tree.slug,
    description: striptags(ent.decode(tree.excerpt?.rendered || "")).trim(),
    featuredImage: assetUrl(tree.featuredImage?.url),
    links: (tree.links || []).map((link) => ({
      title: ent.decode(link.title || ""),
      description: ent.decode(link.description || ""),
      url: link.url,
      img: assetUrl(link.img),
      img_square: assetUrl(link.img_square),
    })),
  }));

  await asset.save(trees, "json");

  console.log(`[ 🌳 ] Imported ${trees.length} trees`);

  return trees;
}
