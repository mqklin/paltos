(() => {
  if(process.env.NODE_ENV !== 'production') {
    require('./test');
  }
})();

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');
const https = require('https');
require('babel-polyfill');
mongoose.Promise = global.Promise;
const morgan = require('morgan');

const server = process.env.NODE_ENV !== 'production' ? http.createServer(app) :  https.createServer({
  key: require('data/ssl/key.js').default,
  cert: require('data/ssl/cert.js').default,
  ca: require('data/ssl/ca.js').default,
}, app);
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server, path: '/ws' });
const configureWebSocketServer = require('./websocket/configureWebSocketServer').default;
configureWebSocketServer(wss);

(async function() {
  try {
    app.use(morgan('combined'));

    await mongoose.connect('mongodb://localhost:27017/paltos');

    app.use(express.static('.'));

    app.get('/',  (req, res, next) => {
      const host = req.headers.host;
      if (host !== 'paltos.org') return res.redirect('https://paltos.org/')
      res.sendFile(path.resolve('build/index.html'));
    });
    app.use('/*',  (req, res, next) => res.redirect('/'));

    if (process.env.NODE_ENV !== 'production') {
      const port = 80;
      server.listen(port, () => console.log('https listening on ' + port));
    } else {
      const port = 443;
      server.listen(port, () => {
        console.log('https listening on ' + port);
        express().get('*', (req, res) => res.redirect('https://paltos.org/')).listen(80);
      });
    }
  }
  catch(e) { console.log(e) }
})();




