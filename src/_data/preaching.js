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

  let asset = new AssetCache("preaching");

  if (asset.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("[ 🎤 ] Serving sermons from the cache…");
    return asset.getCachedValue();
  }

  console.log("[ 🎤 ] Fetching fresh sermons…");

  const allSermons = await wpPaginator(`${process.env.API_BASE}sermons?per_page=50`);

  allSermons.forEach((sermon) => {
    sermon.title = ent.decode(sermon.title.rendered);
    sermon.content = ent.decode(sermon.content.rendered);
    sermon.description = sermon.content;

    if (sermon.sermon_data.url) {
      sermon.sermon_data.url = sermon.sermon_data.url.replace('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');
    }
  });

  await asset.save(allSermons, "json");

  console.log(`[ 🎤 ] Imported ${allSermons.length} sermon recordings`);

  return allSermons;
}
