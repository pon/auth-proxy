var Proxy = require('../');
var proxy = new Proxy({
  destination: {
    host: 'localhost',
    port: 8080,
    protocol: 'http'
  },
  source: {
    host: 'localhost',
    port: 8090
  }
});

proxy.start();
