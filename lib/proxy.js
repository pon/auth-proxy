var Hapi      = require('hapi');
var auth      = require('./auth');
var internals = {};
/**
 * Build and return a configured Hapi proxy
 * @param {object} config
 * @returns {object} Hapi server
 */
var proxy = function (config) {
  var routes = internals.buildRoutes(config);
  var options = internals.buildOptions(config);
  var server = new Hapi.Server(config.source.host, config.source.port, options);
  server.route(routes);

  //Register Basic Auth Plugin
  server.pack.register(require('hapi-auth-basic'), function (err) {
    if (err) {
      throw(err);
    } else {
      server.auth.strategy('basic', 'basic', true, {
        validateFunc: auth.validate
      });
    }
  });

  return server;
};

/**
 * Takes in the config object and builds the
 * Hapi routes
 * @param {object} config
 * @returns {object} Hapi routes object
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
 * @param {object} config
 * @returns {object} Hapi options object
 */
internals.buildOptions = function (config) {
  return {
    payload: {
      maxBytes: 1073741824
    }
  };
};

module.exports = proxy;
