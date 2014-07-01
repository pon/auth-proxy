var fs        = require('fs');
var sqlite3   = require('sqlite3');
var internals = {};
/**
 * Checks to see if a database exists at
 * the specified name
 * @param {string} dbName
 * @returns {boolean}
 */
exports.checkDbExists = function (dbName) {
  return fs.existsSync(internals.buildPath(dbName));
};

/**
 * Creates an empty sqlite3 db with the
 * schema for the server
 * @param {string} dbName
 * @param {function (err)} done
 */
exports.createEmptyDb = function (dbName, done) {
  var db = new sqlite3.Database(internals.buildPath(dbName), function (err) {
    var createSql = fs.readFileSync(internals.buildPath('schema.sql')).toString();
    db.run(createSql, done);
  });
};

/**
 * Returns a sqlite instance for the dbName
 * provided
 * @param {string} dbName
 * @param {function (err, database)} done
 */
exports.getDbInstance = function (dbName, done) {
  var db = new sqlite3.Database(internals.buildPath(dbName), function (err) {
    done(err, db);
  });
};

internals.buildPath = function (dbName) {
  return __dirname + '/../data/' + dbName;
};
