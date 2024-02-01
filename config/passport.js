// TO-DO verify the verify callback for the passport-local strategy

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { sequelize } = require('../database/models')


//using olyve, should have a validate function 