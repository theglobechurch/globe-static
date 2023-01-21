module.exports = {
  pagination: {
    data: "pages",
    size: 1,
    alias: "p"
  },
  layout: "textPage",
  eleventyComputed: {
    title: (data) => data.p.title,
    featuredImage: (data) => data.p.featured_img_url,
    description: (data) => data.p.description,
    permalink: (data) => `${data.p.url}/index.html`
  }
}
