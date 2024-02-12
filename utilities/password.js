const bcrypt = require("bcrypt");
const saltRounds = 10;

// TODO
function comparePassword(plaintextPassword, hashedPassword) {
    bcrypt.compare(plaintextPassword, hashedPassword, function (err, result) {
        //check if result is true or false, do things based on it
    })
}


function hashPassword(plaintextPassword) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(plaintextPassword, salt, function(err, hash) {
            // Store hash and salt in user DB.
        });
    });
}

module.exports = {
    comparePassword,
    hashPassword,
}