var Lab       = require('lab');
var auth      = require('../../lib/auth');
var fs        = require('fs');
var sqlite3   = require('sqlite3');

Lab.experiment('checkDbExists', function () {

  var db = __dirname + '/../../data/existsTest.sqlite3';

  Lab.before(function (done) {
    fs.openSync(db, 'w');
    done();
  });

  Lab.test('returns false when db does not exist', function (done) {
    Lab.expect(auth.checkDbExists('asdf')).to.equal(false);
    done();
  });

  Lab.test('returns true when db does exist', function (done) {
    Lab.expect(auth.checkDbExists('existsTest')).to.equal(true);
    done();
  });

  Lab.after(function (done) {
    fs.unlinkSync(db);
    done();
  });
});

Lab.experiment('createEmptyDb', function () {

  var dbPath = __dirname + '/../../data/createTest.sqlite3';

  Lab.before(function (done) {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    done();
  });

  Lab.test('should create the empty db', function (done) {
    auth.createEmptyDb('createTest', function (err) {
      Lab.expect(err).to.equal(null);
      var db = new sqlite3.Database(dbPath, function (err) {
        Lab.expect(err).to.equal(null);
        db.get('SELECT name FROM sqlite_master ' +
               'WHERE type = \'table\' AND name = \'users\'', function (err, row) {
          Lab.expect(err).to.equal(null);
          Lab.expect(row.name).to.equal('users');
          done();
        });
      });
    });
  });

  Lab.after(function (done) {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    done();
  });
});
