const crypto = require('crypto');
// to use bcrypt possibly

// TODO
function comparePassword(password, hashedPassword, salt) {}
function hashPassword(password) {}

module.exports.validPassword = validPassword; //rename
module.exports.genPassword = genPassword;