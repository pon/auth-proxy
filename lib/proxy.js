var Hapi      = require('hapi');
var auth      = require('./auth');

var internals = {};

var proxy = function (config) {
  var routes = internals.buildRoutes(config);
  var options = internals.buildOptions(config);
  console.log(options);
  var server = new Hapi.Server(config.source.host, config.source.port, options);
  server.routes(routes);

  //Register Basic Auth Plugin
  server.pack.register(require('hapi-basic-auth'), function (err) {
    if (err) {
      throw err;
    } else {
      server.auth.strategy('basic', 'basic', true, {
        validateFunc: auth.validate
      })
    }
  });

  return server;
};

/**
 * Takes in config object and builds the
 * Hapi routes for the proxy
 * @author - Peter Nagel
 * @param {Object} config
 * @returns Object
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
 * Hapi options for the proxy
 * @author - Peter Nagel
 * @param {Object} config
 * @returns Object
 */
internals.buildOptions = function (config) {
  var options = config.options || {};
  var options.maxBytes = options.maxBytes || 1073741824;
  return options;
};
