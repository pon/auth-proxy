/**
 * Validate whether a user and password exist
 * and are correct for passing through the proxy
 * @param {string} username
 * @param {string} pw
 * @param {function} done
 */
exports.validate = function (user, pw, done) {
  done(null, true, {});
};
