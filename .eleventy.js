module.exports = function(eleventyConfig) {
  eleventyConfig.ignores.add("./src/projects/")

  return {
    dir: {
      input: "src"
    }
  }
};