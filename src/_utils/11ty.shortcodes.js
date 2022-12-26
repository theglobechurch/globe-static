const eleventyImage = require("@11ty/eleventy-img");

module.exports = {
  rwdImg: async function(filepath, alt, widths, classes = "", sizes = "(min-width: 22em) 30vw, 100vw") {

    let options = {
      formats: ["avif", "webp", "png"],
      widths: widths || [null],
      urlPath: "/_assets/img/built/",
      outputDir: "./dist/_assets/img/built/",
    };

    let stats = await eleventyImage(filepath, options);

    return eleventyImage.generateHTML(stats, {
      alt,
      loading: "lazy",
      decoding: "async",
      sizes: sizes,
      class: classes,
    });
  },

  svgIcon: function(name, cls = null) {
    return `<svg class="${cls}"><use xlink:href="/_assets/svgSprite.svg#svg-${name}"></use></svg>`;
  }
}
