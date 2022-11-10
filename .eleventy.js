const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const svgSprite = require("eleventy-plugin-svg-sprite");
const shortcodes = require("./src/_utils/11ty.shortcodes.js");
const filters = require("./src/_utils/11ty.filters.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.setQuietMode(true);

  // Plugins
  // eleventyConfig.addPlugin(directoryOutputPlugin);

  eleventyConfig.addPlugin(svgSprite, {
    path: "./src/_assets/svg"
  });

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", shortcodes.testImg);

  // Filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  const layouts = [
    {name: 'default', path: 'layouts/base.njk'},
    {name: 'textPage', path: 'layouts/textPage.njk'},
  ];
  layouts.forEach(layout => eleventyConfig.addLayoutAlias(layout.name, layout.path));


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
