const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const shortcodes = require("./src/_utils/11ty.shortcodes.js");
const filters = require("./src/_utils/11ty.filters.js");

module.exports = function (eleventyConfig) {
  // eleventyConfig.setQuietMode(true);

  // Plugins
  // eleventyConfig.addPlugin(directoryOutputPlugin);

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", shortcodes.testImg);

  // Filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  return {
    templateFormats: ["html", "njk", "md"],
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
