var chai      = require('chai');
var expect    = chai.expect;
var auth      = require('../lib/auth');
var Promise   = require('bluebird');
var bcrypt    = require('bcrypt');
var sqlite3   = require('sqlite3');

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

    it('should be true for a valid user/pw', function (done) {
      auth.validate('user', 'pw', function (res) {
        expect(res).to.eql.true;
        done();
      });
    });

    it('should be false for bad username', function (done) {
      auth.validate('baduser', 'pw', function (res) {
        expect(res).to.eql(false);
        done();
      });
    });

    it('should reject with user and bad pw', function (done) {
      auth.validate('user', 'badpw', function (res) {
        expect(res).to.eql(false);
        done();
      });
    });
  });
});
