const eleventyImage = require("@11ty/eleventy-img");
const dayjs = require("dayjs");

module.exports = {

  socialImg: async function(filepath) {
    if (!filepath || filepath === "false") {
      return false
    }

    let options = {
      formats: ["jpeg"],
      widths: [1200],
      urlPath: "/_assets/img/built/",
      outputDir: "./dist/_assets/img/built/",
      cacheOptions: {
        duration: "2y",
        directory: ".imgCache",
        removeUrlQueryParams: false,
      },
    }

    let metadata = await eleventyImage(filepath, options);
    let data = metadata.jpeg[metadata.jpeg.length - 1];
    return data.url;

  },

  rwdImg: async function(filepath, alt, widths, classes = "", sizes = "(min-width: 22em) 30vw, 100vw", lazy = true) {

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
      loading: lazy ? "lazy" : "eager",
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

  mapUrl: function(address) {
    if (!address) { return null }

    return `https://www.google.com/maps/search/?api=1&query=${ encodeURIComponent(address) }`;
  },

  dateRange: function(startDate, endDate) {

    const my = 'MMMM YYYY';
    const y = 'YYYY';

    startDate = dayjs(startDate);
    if (endDate) {
      endDate = dayjs(endDate);
    } else {
      endDate = startDate;
    }

    if (startDate.format(my) === endDate.format(my)) {
      return startDate.format(my);
    }

    if (startDate.format(y) === endDate.format(y)) {
      return `${startDate.format('MMMM')} – ${endDate.format(my)}`;
    }

    return `${startDate.format(my)} – ${endDate.format(my)}`;
  }
}
