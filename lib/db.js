var fs        = require('fs');
var sqlite3   = require('sqlite3');

/**
 * Checks to see if a database exists at
 * the specified name
 * @param {string} dbName
 * @returns {boolean}
 */
exports.checkDbExists = function (dbName) {
  return fs.existsSync(__dirname + '/../data/' + dbName);
};

/**
 * Creates an empty sqlite3 db with the
 * schema for the server
 * @param {string} dbName
 * @param {function (err)} done
 */
exports.createEmptyDb = function (dbName, done) {
  var dbPath  = __dirname + '/../data/' + dbName;
  var sqlPath = __dirname + '/../data/schema.sql';
  var db = new sqlite3.Database(dbPath, function (err) {
    var createSql = fs.readFileSync(sqlPath).toString();
    db.run(createSql, done);
  });
};

/**
 * Returns a sqlite instance for the dbName
 * provided
 */
exports.getDbInstance = function (dbName, done) {

};
