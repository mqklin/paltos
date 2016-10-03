const autoprefixer = require('autoprefixer');
const dirs = require('./constants').dirs;

module.exports = {
  entry: [
    'babel-polyfill',
    dirs.src,
  ],
  output: {
    path: dirs.build,
    filename: 'bundle.js',
    publicPath: '/build/',
  },
  resolve: {
    root: dirs.src,
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
    ],
    noParse: [/moment.js/],
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] }),
  ],
};
