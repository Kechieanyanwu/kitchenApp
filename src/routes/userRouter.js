const express = require('express');
const userRouter = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded( { extended: false } ); //used only in specific routes
const { validateNewUser } = require("../../utilities/model");
const { hashPassword }  = require("../../utilities/password");
const { addNewItem, deleteItem } = require('../controllers/controller');
const { User } = require('../../database/models/user');

// user register
userRouter.post("/register", jsonParser, validateNewUser, async (req, res, next) => {

    console.log("IN HERE")
    const {hash, salt} = await hashPassword(req.password);

    const userObject = {
        username: req.username,
        email: req.email,
        hashed_password: hash,
        salt: salt
    }
    let addedUser
    try {        
        addedUser = await addNewItem(User, userObject)
    } catch (err) {
        next(err);
    }
    
    res.status(201).send(addedUser);

})

// // user login / authentication
//user will login and we will save userID to req.session? 

// user delete 
userRouter.delete("/:itemID", jsonParser, async (req, res, next) => {
    const itemID = req.params.itemID;
    let updatedUsers;

    try {
        updatedUsers = await deleteItem(User, itemID);
    } catch (err) {
        next(err);
    }
    res.status(200).send(updatedUsers)
})




const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

userRouter.use(errorHandler);


module.exports = userRouter;