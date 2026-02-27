const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for GitHub Codespaces: Metro rejects requests with non-localhost Host headers
// (DNS rebinding protection), returning JSON errors instead of JS bundles.
// Rewrite the Host header to localhost before Metro's security check runs.
const originalEnhanceMiddleware = config.server?.enhanceMiddleware;
config.server = {
  ...config.server,
  enhanceMiddleware: (metroMiddleware, server) => {
    const enhanced = originalEnhanceMiddleware
      ? originalEnhanceMiddleware(metroMiddleware, server)
      : metroMiddleware;

    return (req, res, next) => {
      if (req.headers.host && req.headers.host.includes('app.github.dev')) {
        req.headers.host = 'localhost:8081';
      }
      return enhanced(req, res, next);
    };
  },
};

module.exports = config;
