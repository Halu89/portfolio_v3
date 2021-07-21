module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/assets/misc');
  eleventyConfig.addPassthroughCopy('./src/assets/images');
  // eleventyConfig.addPassthroughCopy('./src/assets/js');
  // Use Webpack
  eleventyConfig.addPassthroughCopy('./src/assets/style');
  eleventyConfig.setPugOptions({ doctype: 'html' });

  return {
    dir: {
      input: 'src',
    },
  };
};
