const bcrypt = require("bcrypt");
const saltRounds = 10;

// TODO
function comparePassword(plaintextPassword, hashedPassword) {
    bcrypt.compare(plaintextPassword, hashedPassword, function (err, result) {
        //check if result is true or false, do things based on it
    })
}


function hashPassword(plaintextPassword) {
    bcrypt.hash(plaintextPassword, saltRounds, function (err, hash) {
        //return hash? Or store hash in db?
    })
}

module.exports.comparePassword = comparePassword; //rename
module.exports.hashPassword = hashPassword;