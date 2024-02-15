const bcrypt = require("bcrypt");
const saltRounds = 10;

// TODO
function comparePassword(plaintextPassword, hashedPassword) {
    bcrypt.compare(plaintextPassword, hashedPassword, function (err, result) {
        //check if result is true or false, do things based on it
    })
}


async function hashPassword(plaintextPassword) {
    console.log("in hash pwd"); //test
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plaintextPassword, salt);

    return {hash, salt}; 
}

module.exports = {
    comparePassword,
    hashPassword,
}