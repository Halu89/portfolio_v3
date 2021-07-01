module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/assets/misc');
  eleventyConfig.addPassthroughCopy('./src/assets/images');
  // eleventyConfig.addPassthroughCopy('./src/assets/js'); Use webpack
  eleventyConfig.addPassthroughCopy('./src/assets/style');

  return {
    dir: {
      input: 'src',
    },
  };
};
