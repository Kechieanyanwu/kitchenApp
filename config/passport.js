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
        user = await User.findOne({ where: { email: username }})
    } catch (err) {
        done(err); //how is this handled? Check documentation 
    }

    if (!user) {
        return done(null, false)
    } else {

        try {
            passwordIsEqual = await comparePassword(password, user.hashed_password)
        } catch (err) {
            done(err)
        }
    
        console.log(passwordIsEqual); //test
        if (passwordIsEqual) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    }

}


const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser( async (userID, done) => {
    let user;
    try {
        user = await User.findByPk(userID);
    } catch (err) {
        done(err)
    }
     done(null, user);
}) 