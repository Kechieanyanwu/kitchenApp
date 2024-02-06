// TO-DO verify the verify callback for the passport-local strategy

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { sequelize } = require('../database/models');
const { User } = require("../database/models/user")

const customFields = {
    usernameField: "email",
    passwordField: "password"
}

const verifyCallback = (username, password, done) => {

    //find the specified user based on email
        //if no user, return done(null, false)
        //if any db error, return done(err) --- GENERAL CATCH
    //get the hashedPassword for this user
        //use comparePassword to compare the provided and hashed pwd
            //if password matched, return done(null, user)
            // else return done(null, false)

}


const strategy = new LocalStrategy(customFields, verifyCallback);


//using olyve, should have a validate function 