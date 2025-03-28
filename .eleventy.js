import pluginRss from "@11ty/eleventy-plugin-rss";
import svgSprite from "eleventy-plugin-svg-sprite";
import { shortcodes } from "./src/_utils/11ty.shortcodes.js";
import { filters } from "./src/_utils/11ty.filters.js";
import { collections } from "./src/_utils/11ty.collections.js";

export default async function (eleventyConfig) {
  const { EleventyRenderPlugin } = await import("@11ty/eleventy");
  eleventyConfig.setQuietMode(true);

  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(EleventyRenderPlugin);;

  eleventyConfig.addPlugin(svgSprite, {
    path: "./src/_assets/svg",
    outputFilepath: "./dist/_assets/svgSprite.svg"
  });

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("rwdImg", shortcodes.rwdImg);
  eleventyConfig.addNunjucksAsyncShortcode("socialImg", shortcodes.socialImg);
  eleventyConfig.addNunjucksShortcode("mapUrl", shortcodes.mapUrl);
  eleventyConfig.addNunjucksShortcode("svgIcon", shortcodes.svgIcon);
  eleventyConfig.addNunjucksShortcode("dateRange", shortcodes.dateRange);

  // Filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  // Collections
  Object.keys(collections).forEach((collectionName) => {
    eleventyConfig.addCollection(collectionName, collections[collectionName]);
  });

  const layouts = [
    { name: 'default', path: 'layouts/base.njk' },
    { name: 'textPage', path: 'layouts/textPage.njk' },
  ];
  layouts.forEach(layout => eleventyConfig.addLayoutAlias(layout.name, layout.path));

  // // Copy the files to the right place
  [
    "src/humans.txt",
    "src/robots.txt",
  ].forEach(path => eleventyConfig.addPassthroughCopy(path));

  eleventyConfig.addPassthroughCopy({ "src/_assets/favicon/**": "." });
  eleventyConfig.addPassthroughCopy({ "src/_assets/img/passThrough/podcast-cover.jpg": "assets/podcast-cover.jpg" });
  eleventyConfig.addPassthroughCopy({ "src/_assets/img/passThrough/the-globe-church-og.jpg": "_assets/img/the-globe-church-og.jpg" });
  eleventyConfig.addPassthroughCopy({ "src/_assets/img/passThrough/**": "assets/img/passThrough" });

  eleventyConfig.addWatchTarget("./src/_assets/css/");

  eleventyConfig.addGlobalData("buildDate", new Date());
}

export const config = {
  templateFormats: ["html", "njk", "md", "11ty.js"],
  pathPrefix: "/",
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  dataTemplateEngine: "njk",
  passthroughFileCopy: true,
  dir: {
    input: `./src`,
    output: `./dist`,
  },
}
