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

  rwdImg: async function (
    src,
    alt,
    widths,
    cssClasses = "",
    sizes = "(min-width: 22em) 30vw, 100vw",
    lazy = true,
    aspectRatio = null
  ) {
    let imgWidths = widths;
    let filepath = src;

    // Liquid doesn't like sending through arrays… if we get a string
    // where it should be an array… assume that it will be comma seperated
    if (typeof imgWidths === 'string' || imgWidths instanceof String) {
      imgWidths = imgWidths.split(',');
    }

    // If an aspectRatio supplied we're going to precrop it to the
    // given size… We'll then use this image to generate all the other
    // images from.
    if (aspectRatio !== null) {
      if (typeof aspectRatio === 'string' || aspectRatio instanceof String) {
        aspectRatio = aspectRatio.split(':');
      }
      const [ratioW, ratioH] = aspectRatio;
      const cropOptions = {
        // We want to get the data rather than a <picture> tag
        returnType: "object",
        outputDir: "./dist/_assets/img/ratio/",

        // We just want one here, default is to output webp too
        formats: ["jpg"],

        cacheOptions: {
          duration: "2y",
          directory: ".imgCache/cropped",
          removeUrlQueryParams: false,
        },
        transform: async (sharp) => {
          const meta = await sharp.metadata();
          const cropHeight = Math.round(meta.width * (ratioH / ratioW));
          return sharp.resize(meta.width, cropHeight, {
            fit: "cover",
            position: "center",
          });
        }
      };

      const cropped = await eleventyImage(src, cropOptions);
      filepath = Object.values(cropped)[0]?.[0]?.outputPath;
    }

    let html = await eleventyImage(filepath, {
      returnType: "html",
      widths: imgWidths,
      urlPath: "/_assets/img/built/",
      outputDir: "./dist/_assets/img/built/",
      formats: ['webp', 'jpg'],
      htmlOptions: {
        imgAttributes: {
          "eleventy:ignore": "",
          alt,
          sizes,
          class: cssClasses,
          loading : lazy ? "lazy" : "eager",
          decoding: "async",
        }
      },
      cacheOptions: {
        duration: "2y",
        directory: ".imgCache",
        removeUrlQueryParams: false,
      },
    });

    return html;
  },
}
