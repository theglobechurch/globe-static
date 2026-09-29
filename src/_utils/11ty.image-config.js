// Shared eleventy-img output settings for the site's built (non-cropped)
// images. Used both by the shortcodes that call eleventyImage() directly
// (11ty.shortcodes.async.js) and by the on-request dev-server middleware
// registered in .eleventy.js, which needs the same outputDir/urlPath/
// cacheOptions to regenerate an image correctly when it's requested on
// demand during --serve.
export const IMAGE_URL_PATH = "/_assets/img/built/";
export const IMAGE_OUTPUT_DIR = "./dist/_assets/img/built/";
export const IMAGE_CACHE_OPTIONS = {
  duration: "2y",
  directory: ".imgCache",
  removeUrlQueryParams: false,
};
