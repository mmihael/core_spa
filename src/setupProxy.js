const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080'
    })
  );
  app.use(
    '/websocket',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      ws: true
    })
  );
};