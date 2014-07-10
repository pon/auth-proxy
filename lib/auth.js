var bcrypt      = require('bcrypt');
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
 * @param {Function} done
 */
exports.validate = function (username, password, done) {
  var db = new sqlite3.Database(__dirname + '/../data/db.sqlite3');
  db.get('SELECT * FROM users WHERE username = $username', {
    $username: username
  }, function (err, row) {
    if (err || row === undefined) {
      done(false);
    } else {
      bcrypt.compare(password, row.password, function (err, res) {
        if (err || !res) {
          done(false);
        } else {
          done(true);
        }
      });
    }
  });
};

