import esbuild from 'esbuild';

export default class {
  data() {
    return {
      layout: '',
      permalink: false,
      eleventyExcludeFromCollections: true,
    };
  }

  async render(data) {
    esbuild
      .build({
        entryPoints: ['./src/_assets/js/main.js'],
        bundle: true,
        minify: true,
        outfile: './dist/_assets/js/main.js',
      })
      .catch(() => process.exit(1));
  }
};
