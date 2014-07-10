var chai      = require('chai');
var expect    = chai.expect;
var auth      = require('../lib/auth');
var Promise   = require('bluebird');
var bcrypt    = require('bcrypt');
var sqlite3   = require('sqlite3');

chai
.use(require('chai-as-promised'))
.use(require('chai-things'));

describe('auth', function () {
  describe('validate', function () {

    before(function(done) {
      var pHash = Promise.promisify(bcrypt.hash);
      var db = new sqlite3.Database(__dirname + '/../data/db.sqlite3');
      return pHash('pw', 8)
      .then(function (passwordHash) {
        db.run('INSERT INTO users (username, password) VALUES ($username, $password)', {
          $username: 'user',
          $password: passwordHash
        });
        done();
      });
    });

    it('should fulfill for a valid user/pw', function () {
      return expect(auth.validate('user', 'pw')).to.be.fulfilled;
    });

    it('should reject with user does not exist for bad username', function () {
      return expect(auth.validate('baduser', 'pw'))
        .to.be.rejectedWith(auth.UserDoesNotExistError);
    });

    it('should reject with user and bad pw', function () {
      return expect(auth.validate('user', 'badpw'))
        .to.be.rejectedWith(auth.InvalidPasswordError);
    });
  });
});
