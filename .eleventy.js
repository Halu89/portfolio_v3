module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/assets/misc');
  eleventyConfig.addPassthroughCopy('./src/assets/images');
  eleventyConfig.addPassthroughCopy('./src/assets/js');
  eleventyConfig.addPassthroughCopy('./src/assets/style/index.css');

  return {
    dir: {
      input: 'src',
    },
  };
};
