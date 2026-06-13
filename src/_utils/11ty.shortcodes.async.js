import eleventyImage from "@11ty/eleventy-img";

export const asyncShortcodes = {

  socialImg: async function (filepath) {
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

  rwdImg: async function (filepath, alt, widths, classes = "", sizes = "(min-width: 22em) 30vw, 100vw", lazy = true, aspectRatio = null) {

    // Liquid doesn't like sending through arrays… if we get a string
    // where it should be an array… assume that it will be comma seperated
    if (typeof widths === 'string' || widths instanceof String) {
      widths = widths.split(',');
    }

    // [TODO] Something with the aspect ratio cropping…
    // I couldn't get this to play ball.
    // Sad face
    // :^(

    let options = {
      formats: ["webp", "jpg"],
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
      class: classes
    });
  },
}
