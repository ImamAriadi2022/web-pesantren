const path = require('path');

module.exports = {
  // Konfigurasi lainnya...
  resolve: {
    fallback: {
      "fs": false,
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "url": require.resolve("url/")
    }
  }
};