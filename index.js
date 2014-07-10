var proxy = require('./lib/proxy');

var proxyFactory = function (config) {
  return new proxy(config);
};

module.exports = proxyFactory;
