const express = require('express');
const userRouter = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json(); //used only in specific routes
const emailValidator = require("email-validator");
const urlEncodedParser = bodyParser.urlencoded(); //used only in specific routes

// // body-parser deprecated undefined extended: provide extended option src/routes/userRouter.js:5:37

// // user register
// userRouter.put("/register", jsonParser, async (req, res, next) => {
//     // user sends an email, username and password
//     // object is verified that it is an email, username exists, and password is strong enough
//         // will use weak strong identifiers on the frontend 
//     //password is hashed
//     //new object is sent to db using addNewItem
// })

// // user login / authentication
// // user delete 


// const validateNewUser = (req, res, next) => {
//     //validate email
//     if (emailValidator.validate(req.body.email)) {
//         req.email = req.body.email
//     } else {
//         const err = new Error("Invalid Email");
//         err.status = 400;
//         next(err);
//     };
//     req.username = req.body.username;
//     req.password = req.body.password;
//     next();
// }




const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

userRouter.use(errorHandler);


module.exports = userRouter;