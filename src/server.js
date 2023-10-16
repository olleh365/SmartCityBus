//src/server.js

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/proxy', // Specify the path you want to proxy, e.g., /proxy
    createProxyMiddleware({
      target: 'http://apis.data.go.kr', // Specify the target API domain
      changeOrigin: true,
    })
  );
};