var argv      = require('yargs').argv;
var bcrypt    = require('bcrypt');
var fs        = require('fs');
var gulp      = require('gulp');
var plugins   = require('gulp-load-plugins')();
var Promise   = require('bluebird');
var sqlite3   = require('sqlite3');

gulp.task('test', function () {
  return gulp.src(['test/unit.js'])
  .pipe(plugins.mocha({
    reporter: 'spec'
  }))
  .pipe(plugins.istanbul.writeReports());
});

gulp.task('createdb', function (done) {
  if (fs.existsSync('data/db.sqlite3')) {
    fs.unlinkSync('data/db.sqlite3');
  }

  var db = new sqlite3.Database('data/db.sqlite3', function (err) {
    var createSql = fs.readFileSync('data/schema.sql').toString();
    db.run(createSql, done);
  });
});

gulp.task('adduser', function (done) {
  var pHash = Promise.promisify(bcrypt.hash);
  var db = new sqlite3.Database('data/db.sqlite3');
  return Promise.all([
    pHash(argv.username, 8),
    pHash(argv.password, 8)
  ])
  .spread(function (usernameHash, passwordHash) {
    db.run('INSERT INTO users (username, password) VALUES ($username, $password)', {
      $username: usernameHash,
      $password: passwordHash
    });
  });
});
