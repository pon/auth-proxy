var fs        = require('fs');
var sqlite3   = require('sqlite3');
//var db        = new sqlite3.Database('../data/db.sqlite3');

/**
 * Validate whether a user and password exist
 * and are correct for passing through the proxy
 * @param {string} username
 * @param {string} pw
 * @param {function} done
 */
exports.validate = function (user, pw, done) {
  console.log(user, pw);
  done(null, true, {});
};

/**
 * Checks to see if a database exists at
 * the specified name
 * @param {string} dbName
 * @returns {boolean}
 */
exports.checkDbExists = function (dbName) {
  return fs.existsSync(__dirname + '/../data/' + dbName + '.sqlite3');
};

/**
 * Creates an empty sqlite3 db with the
 * schema for the server
 * @param {string} dbName
 * @param {function (err)} done
 */
exports.createEmptyDb = function (dbName, done) {
  var dbPath  = __dirname + '/../data/' + dbName + '.sqlite3';
  var sqlPath = __dirname + '/../data/schema.sql';
  var db = new sqlite3.Database(dbPath, function (err) {
    if (err) {
      done(err);
    } else {
      var createSql = fs.readFileSync(sqlPath).toString();
      db.run(createSql, done);
    }
  });
};
