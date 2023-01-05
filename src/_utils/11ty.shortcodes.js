const eleventyImage = require("@11ty/eleventy-img");
const dayjs = require("dayjs");

module.exports = {
  rwdImg: async function(filepath, alt, widths, classes = "", sizes = "(min-width: 22em) 30vw, 100vw") {

    let options = {
      formats: ["avif", "webp", "jpg"],
      widths: widths || [null],
      urlPath: "/_assets/img/built/",
      outputDir: "./dist/_assets/img/built/",
      cacheOptions: {
        duration: "2y",
        directory: ".imgCache",
        removeUrlQueryParams: false,
      },
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

  svgIcon: function(name, cls = null, title = null) {
    if (title !== null) {
      title = `<title>${title}</title>`;
    }
    return `<svg class="${cls}">${title}<use xlink:href="/_assets/svgSprite.svg#svg-${name}"></use></svg>`;
  },

  dateRange: function(startDate, endDate) {

    const my = 'MMMM YYYY';
    const y = 'YYYY';

    startDate = dayjs(startDate);
    endDate = dayjs(endDate);

    if (startDate.format(my) === endDate.format(my)) {
      return startDate.format(my);
    }

    if (startDate.format(y) === endDate.format(y)) {
      return `${startDate.format('MMMM')} – ${endDate.format(my)}`;
    }

    return `${startDate.format(my)} – ${endDate.format(my)}`;
  }
}
