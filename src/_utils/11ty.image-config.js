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

// Many images come from the WordPress API at build time (featured images,
// author photos, leader thumbnails). If one of those URLs is broken or gone,
// falling back to a local placeholder keeps a single bad CMS image from
// failing the entire build.
export const PLACEHOLDER_IMAGE_PATH = "./src/_assets/img/passThrough/placeholder/1.jpg";
export const SOCIAL_IMAGE_FALLBACK_URL = "/_assets/img/the-globe-church-og.jpg";
