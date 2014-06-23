var Hapi      = require('hapi');
var internals = {};
/**
 * Build and return a configured Hapi proxy
 * @param config
 * @returns Hapi server
 */
var proxy = function (config) {
  var routes = internals.buildRoutes(config);
  var options = internals.buildOptions(config);
  var server = new Hapi.Server(config.source.host, config.source.port, options);
  server.route(routes);
  return server;
};

/**
 * Takes in the config object and builds the
 * Hapi routes
 * @param config
 * @returns Hapi routes object
 */
internals.buildRoutes = function (config) {
  return [
    {
      method: '*',
      path: '/{p*}',
      handler: {
        proxy: {
          host: config.destination.host,
          port: config.destination.port,
          protocol: config.destination.protocol,
          redirects: 5,
          passThrough: true
        }
      }
    }
  ];
};

/**
 * Takes in the config object and builds the
 * Hapi options for the server
 * @param config
 * @returns Hapi options object
 */
internals.buildOptions = function (config) {
  return {
    payload: {
      maxBytes: 1073741824
    }
  };
};

module.exports = proxy;
