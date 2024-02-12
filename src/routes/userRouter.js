const express = require('express');
const userRouter = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json(); //used only in specific routes
const urlEncodedParser = bodyParser.urlencoded( { extended: false } ); //used only in specific routes
const { validateNewUser } = require("../../utilities/model");
const { hashPassword }  = require("../../utilities/password");
const { addNewItem } = require('../controllers/controller');

// user register
userRouter.post("/register", jsonParser, validateNewUser, async (req, res, next) => {
    console.log(req.email);
    console.log(req.username);
    console.log(req.password);
    const {hash, salt} = await hashPassword(req.password);

    console.log("hash", hash); //test
    console.log("salt", salt); //test
    // res.status(201).send("User succesfully created")
    const userObject = {
        username: req.username,
        email: req.email,
        hashed_password: hash,
        salt: salt
    }

    //amend to use a new function, add new user
    // try {
    //     await addNewItem(User, userObject); //feels like a wasted variable, taking out the assignment
    // } catch (err) {
    //     next(err);
    // }

    res.status(201).send("User succesfully created")




    
    // user sends an email, username and password
    // object is verified that it is an email, username exists, and password is strong enough
        // will use weak strong identifiers on the frontend 
    //password is hashed
    //new object is sent to db using addNewItem
})

// // user login / authentication
// // user delete 




const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

userRouter.use(errorHandler);


module.exports = userRouter;