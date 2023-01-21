module.exports = {
  pagination: {
    data: "people",
    size: 1,
    alias: "person",
    before: function(paginationData) {
      return paginationData.filter(entry => entry.hasProfilePage === "1");
    }
  },
  layout: "layouts/base.njk",
  eleventyComputed: {
    title: (data) => data.person.name,
    description: (data) => data.person.description,
    permalink: (data) => `people/${data.person.slug}/index.html`
  }

}
