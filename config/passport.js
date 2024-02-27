// TO-DO verify the verify callback for the passport-local strategy

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { sequelize } = require('../database/models');
const { User } = require("../database/models/user");
const { comparePassword } = require("../utilities/password");

const customFields = {
    usernameField: "email",
    passwordField: "password"
}

const verifyCallback = async (username, password, done) => {
    let user;
    let passwordIsEqual;

    try {
        user = await User.findOne({ where: { username: username }})
    } catch (err) {
        done(err); //how is this handled? Check documentation 
    }

    if (user == null) {
        return done(null, false)
    }

    try {
        passwordIsEqual = await comparePassword(passport, user.hashed_password)
    } catch (err) {
        done(err)
    }

    if (passwordIsEqual) {
        return done(null, user)
    }

    return done(null, false)

}


const strategy = new LocalStrategy(customFields, verifyCallback);


//using olyve, should have a validate function 