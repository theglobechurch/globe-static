import { AssetCache } from "@11ty/eleventy-fetch";
import 'dotenv/config'
import ent from 'ent';
import { wpPaginator } from '../_utils/wp.paginator.js';

const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH || "1d";

export default async () => {

  if (!process.env.API_BASE) {
    console.error("🚨 Oh no! No API base url in the env…");
    return [];
  }

  let asset = new AssetCache("sermonseries");

  if (asset.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("[ 📚 ] Serving series from the cache…");
    return asset.getCachedValue();
  }

  console.log("[ 📚 ] Fetching fresh series…");

  const allSeries = await wpPaginator(`${process.env.API_BASE}sermon_series?per_page=50`);

  allSeries.forEach((series) => {
    series.title = ent.decode(series.name);

    if (series.artwork_url) {
      series.artwork_url = series.artwork_url.replace('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');
    }

    // Remove the WP link meta from internal array
    delete series._links;
  });

  await asset.save(allSeries, "json");

  console.log(`[ 📚 ] Imported ${allSeries.length} sermon series`);

  return allSeries;
}
