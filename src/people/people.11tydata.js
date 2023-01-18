module.exports = {
  pagination: {
    data: "people",
    size: 1,
    alias: "person",
    before: function(paginationData) {
      return paginationData.filter(entry => entry.profile_big_bio !== "");
    }
  },
  layout: "layouts/base.njk",
  eleventyComputed: {
    title: (data) => data.person.name,
    description: (data) => data.person.description,
    permalink: (data) => `people/${data.person.slug}/index.html`
  }

}
