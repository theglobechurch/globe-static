import pluginRss from "@11ty/eleventy-plugin-rss";
import svgSprite from "eleventy-plugin-svg-sprite";
import { shortcodes } from "./src/_utils/11ty.shortcodes.js";
import { asyncShortcodes } from "./src/_utils/11ty.shortcodes.async.js";
import { filters } from "./src/_utils/11ty.filters.js";
import { collections } from "./src/_utils/11ty.collections.js";

export default async function (eleventyConfig) {
  const { EleventyRenderPlugin } = await import("@11ty/eleventy");
  eleventyConfig.setQuietMode(true);

  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.addPlugin(svgSprite, {
    path: "./src/_assets/svg",
    outputFilepath: "./dist/_assets/svgSprite.svg"
  });


  // Shortcodes
  Object.keys(asyncShortcodes).forEach((shortcodeName) => {
    eleventyConfig.addAsyncShortcode(shortcodeName, asyncShortcodes[shortcodeName]);
  });
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName]);
  });

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
  eleventyConfig.addPassthroughCopy("src/_assets/css/**/*.css");
  eleventyConfig.addPassthroughCopy({ "src/_assets/img/passThrough": "_assets/img" });

  eleventyConfig.addWatchTarget("./src/_assets/css/");
  eleventyConfig.addWatchTarget("./src/_assets/js/");

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
