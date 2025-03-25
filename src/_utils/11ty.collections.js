export const collections = () => {
  return collection.getFilteredByGlob(["./src/augmentedPages/**/*.njk"]);
}
