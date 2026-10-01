export default {
  pagination: {
    data: "trees",
    size: 1,
    alias: "tree"
  },
  layout: "default",
  eleventyComputed: {
    title: (data) => data.tree.title,
    featuredImage: (data) => data.tree.featuredImage,
    description: (data) => data.tree.description,
    permalink: (data) => `${data.tree.slug}/index.html`
  }
}
