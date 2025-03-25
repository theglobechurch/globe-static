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

  let asset = new AssetCache("podcast");

  if (asset.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("[ 📻 ] Serving podcast from the cache…");
    return asset.getCachedValue();
  }

  console.log("[ 📻 ] Fetching fresh podcast episodes…");

  const allEpisodes = await wpPaginator(`${process.env.API_BASE}podcast?per_page=50`);

  allEpisodes.forEach((episode) => {
    episode.title = ent.decode(episode.title.rendered);
    episode.content = ent.decode(episode.content.rendered);
    episode.description = episode.content;

    if (episode.podcast_data.url) {
      episode.podcast_data.url = episode.podcast_data.url.replace('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');
    }
  });

  await asset.save(allEpisodes, "json");

  console.log(`[ 📻 ] Imported ${allEpisodes.length} podcast episodes`);

  return allEpisodes;
}
