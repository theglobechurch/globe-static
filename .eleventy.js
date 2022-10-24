const shortcodes = require("./shortcodes.js");

module.exports = function (eleventyConfig) {
  // eleventyConfig.setQuietMode(true);
  eleventyConfig.addNunjucksAsyncShortcode("image", shortcodes.testImg);

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
