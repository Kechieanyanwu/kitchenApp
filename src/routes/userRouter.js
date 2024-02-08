const express = require('express');
const userRouter = express.Router(); //creating a router instance
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json(); //used only in specific routes
const urlEncodedParser = bodyParser.urlencoded(); //used only in specific routes



// user register
userRouter.put("/register", jsonParser, async (req, res, next) => {
    // user sends an email, username and password
    // object is verified that it is an email, username exists, and password is strong enough
    //password is hashed
    //new object is sent to db using addNewItem
})

// user login / authentication
// user delete 







const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

userRouter.use(errorHandler);


module.exports = userRouter;