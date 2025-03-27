export const collections = {
  augmented: (collection) => {
    return collection.getFilteredByGlob(["./src/augmentedPages/**/*.njk"]);
  }
}
