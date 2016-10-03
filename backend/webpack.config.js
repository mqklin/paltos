const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
  entry: path.join(__dirname, 'app.js'),
  output: {
    path: __dirname,
    filename: 'backend.js',
    libraryTarget: 'commonjs',
  },
  externals: nodeModules,
  module: {
    loaders: [
      { test: /\.node$/, loader: 'node' },
      { test: /\.json$/, loader: 'json' },
      { test: /\.js$/, loader: 'babel?compact=false' },
    ]
  },
  resolve: {
    root: __dirname,
    extensions: [ '', '.js', '.json', '.jsx', '.es6', '.babel', '.node' ],
  },
  target: 'node',
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
  ],
};
