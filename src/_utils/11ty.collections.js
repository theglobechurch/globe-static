exports.augmented = collection => {
  return collection.getFilteredByGlob(["./src/augmentedPages/**/*.njk"]);
}
