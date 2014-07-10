var bcrypt      = require('bcrypt');
var Promise     = require('bluebird');
var pCompare    = Promise.promisify(bcrypt.compare);
var sqlite3     = require('sqlite3');

exports.UserDoesNotExistError = function () {
  this.name = 'User Does Not Exist Error';
  this.message = 'Username does not exist in the database';
}
exports.UserDoesNotExistError.prototype = Object.create(Error.prototype);
exports.UserDoesNotExistError.constructor = exports.UserDoesNotExistError;

exports.InvalidPasswordError = function () {
  this.name = 'Invalid Password Error';
  this.message = 'Password does not match for the username provided';
}
exports.InvalidPasswordError.prototype = Object.create(Error.prototype);
exports.InvalidPasswordError.constructor = exports.InvalidPasswordError;

/**
 * Validate whether a user and password exist
 * and are correct for passing through the proxy
 * @param {String} username
 * @param {String} password
 * @returns Promise
 */
exports.validate = Promise.method(function (username, password) {
  var db = new sqlite3.Database(__dirname + '/../data/db.sqlite3');
  db.get = Promise.promisify(db.get);
  return db.get('SELECT * FROM users WHERE username = $username', {
    $username: username
  })
  .tap(function (row) {
    if (row === undefined) { throw new exports.UserDoesNotExistError(); }
  })
  .then(function (row) {
    return pCompare(password, row.password)
    .then(function (result) {
      if (!result) { throw new exports.InvalidPasswordError(); }
    });
  })
});
