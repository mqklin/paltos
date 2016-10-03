const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const dirs = require('./constants').dirs;

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: dirs.src,
      },
      {
        test: /.scss$/,
        loaders: ['style', 'css?modules=1&localIdentName=[folder]__[local]', 'postcss', 'sass'],
      },
    ]
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] }),
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};
