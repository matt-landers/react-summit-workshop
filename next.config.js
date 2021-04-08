const withWPEHeadless = require('@wpengine/headless/nextConfig');

module.exports = withWPEHeadless({
  future: {
    webpack5: true,
  },
});
