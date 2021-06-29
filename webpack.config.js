const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/assets/js/app.js',
  output: {
    path: path.resolve(__dirname, '_site/assets/js'),
    filename: 'my-first-webpack.bundle.js',
  },
};
