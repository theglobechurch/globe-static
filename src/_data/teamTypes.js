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

  let asset = new AssetCache("teamtypes");

  if (asset.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("[ 🗜️  ] Serving team types from the cache…");
    return asset.getCachedValue();
  }

  console.log("[ 🗜️  ] Fetching fresh team types…");

  const allTeamTypes = await wpPaginator(`${process.env.API_BASE}team_types?per_page=50`);

  allTeamTypes.forEach((teamType) => {
    teamType.title = ent.decode(teamType.name);

    // Remove the WP link meta from internal array
    delete teamType._links;
  });

  await asset.save(allTeamTypes, "json");

  console.log(`[ 🗜️  ] Imported ${allTeamTypes.length} team types`);

  return allTeamTypes;
}
