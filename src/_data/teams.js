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

  let asset = new AssetCache("teams");

  if (asset.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("[ 👥 ] Serving sermons from the cache…");
    return asset.getCachedValue();
  }

  console.log("[ 👥 ] Fetching fresh teams and groups…");

  const allTeams = await wpPaginator(`${process.env.API_BASE}teams?per_page=50`);

  allTeams.forEach((team) => {
    team.title = ent.decode(team.title.rendered);
    team.summary = ent.decode(team.excerpt.rendered);
    team.content = ent.decode(team.content.rendered).trim();
  });

  await asset.save(allTeams, "json");

  console.log(`[ 👥 ] Imported ${allTeams.length} teams and groups`);

  return allTeams;
}
