const express = require('express');
const http = require('http');
const path = require('path');

const app = new express();

const webpack = require('webpack');
const webpackConfig = require('./webpack-config');

const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true, publicPath: webpackConfig.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const port = 3000;
app.listen(port, () => console.log('Server is listening on http://%s:%s', port));
