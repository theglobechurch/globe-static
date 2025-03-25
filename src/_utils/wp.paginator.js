import Fetch from "@11ty/eleventy-fetch";
import 'dotenv/config'

const WP_CACHE_LENGTH = process.env.WP_CACHE_LENGTH || "1d";

let thisPage;
let totalPages;

export const wpPaginator = async (url, cacheLength = WP_CACHE_LENGTH) => {
  thisPage = 1;
  totalPages = 1;

  let pages = await getPage(url, cacheLength);

  while(totalPages >= thisPage) {
    // merge this with pages
    pages = pages.concat(
      await getPage(url, cacheLength)
    );
  }

  return pages;
};

const getPage = async (url, cacheLength = "1d") => {

  const response = await Fetch(`${url}&page=${thisPage}`, {
    duration: cacheLength,
    type: "json",
    directory: ".cache/.wpCache",
    returnType: "response",
  });

  // console.log(response.headers);

  totalPages = response.headers["x-wp-totalpages"];

  console.log(`[....] Got page ${thisPage} of ${totalPages}`)

  thisPage++;

  return response.body;
}
