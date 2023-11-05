const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const svgSprite = require("eleventy-plugin-svg-sprite");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const shortcodes = require("./src/_utils/11ty.shortcodes.js");
const filters = require("./src/_utils/11ty.filters.js");
const collections = require("./src/_utils/11ty.collections.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.setQuietMode(true);

  // Plugins
  // eleventyConfig.addPlugin(directoryOutputPlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(EleventyRenderPlugin);

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
    {name: 'default', path: 'layouts/base.njk'},
    {name: 'textPage', path: 'layouts/textPage.njk'},
  ];
  layouts.forEach(layout => eleventyConfig.addLayoutAlias(layout.name, layout.path));

  // Copy the files to the right place
  [
    "src/humans.txt",
    "src/robots.txt",
  ].forEach(path => eleventyConfig.addPassthroughCopy(path));

  eleventyConfig.addPassthroughCopy({"src/_assets/favicon/**": "."});
  eleventyConfig.addPassthroughCopy({"src/_assets/img/passThrough/podcast-cover.jpg": "assets/podcast-cover.jpg"});
  eleventyConfig.addPassthroughCopy({"src/_assets/img/passThrough/the-globe-church-og.jpg": "_assets/img/the-globe-church-og.jpg"});

  return {
    templateFormats: ["html", "njk", "md", "11ty.js"],
    pathPrefix: "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: `./src`,
      output: `./dist`,
      includes: "_includes",
      data: "_data",
    },
  };
}
