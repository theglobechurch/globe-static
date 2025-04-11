import { AssetCache } from "@11ty/eleventy-fetch";
import 'dotenv/config'
import { wpPaginator } from '../_utils/wp.paginator.js';

const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH || "1d";

export default async () => {

  if (!process.env.API_BASE) {
    console.error("🚨 Oh no! No API base url in the env…");
    return [];
  }

  let asset = new AssetCache("people");

  if (asset.isCacheValid(WP_CACHE_LENGTH)) {
    console.log("[ 👤 ] Serving people from the cache…");
    return asset.getCachedValue();
  }

  console.log("[ 👤 ] Fetching fresh people");

  const allPeople = await wpPaginator(`${process.env.API_BASE}users?per_page=50`);

  allPeople.forEach((person) => {

    if (person.profile_photo_url) {
      person.profile_photo_url = person.profile_photo_url.replace('globe-assets.ams3.digitaloceanspaces.com', 'assets.globe.church');
    }

    person.hasProfilePage = person.hasProfilePage === "1" ? true : false;
  });

  await asset.save(allPeople, "json");

  console.log(`[ 👤 ] Imported ${allPeople.length} people`);

  return allPeople;

}
