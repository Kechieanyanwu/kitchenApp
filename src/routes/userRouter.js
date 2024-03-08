const express = require('express');
const userRouter = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded( { extended: false } ); //used only in specific routes
const { validateNewUser } = require("../../utilities/model");
const { hashPassword }  = require("../../utilities/password");
const { addNewItem, deleteItem } = require('../controllers/controller');
const { User } = require('../../database/models/user');
const passport = require('passport');

require('../../config/passport');


userRouter.use(passport.initialize());
userRouter.use(passport.session());

// user register
userRouter.post("/register", jsonParser, validateNewUser, async (req, res, next) => {

    // to add a check for whether the email already exists so you can't have a duplicate user 
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
//user will login and we will save use rID to req.session? 
userRouter.post("/login", jsonParser, passport.authenticate("local"), async (req, res, next) => {
    //will improve logic while building frontend 
    
    if (req.user) {
        res.status(200).send("<h1>Authenticated!</h1>");
    } else {
        res.status(401).send("<h1>Unauthorized</h1>");
    }
})

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

// // todo
// app.post("/login", (req, res, next) => {}) //take email and pwd

// // todo
// app.post("/register", (req, res, next) => {})



// /*
// -----------------dummy frontend---------------------
// */

// app.get("/", (req, res) => { // 
//     // res.status(200).json("Hello World");
//     res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
// });

// // When you visit http://localhost:PORT/login, you will see "Login Page"
// app.get('/login', (req, res, next) => { // dummy frontend
   
//     const form = '<h1>Login Page</h1><form method="POST" action="/login">\
//     Enter Username:<br><input type="text" name="username">\
//     <br>Enter Password:<br><input type="password" name="password">\
//     <br><br><input type="submit" value="Submit"></form>';

//     res.send(form);

// });

// // When you visit http://localhost:PORT/register, you will see "Register Page"
// app.get('/register', (req, res, next) => { // dummy frontend

//     const form = '<h1>Register Page</h1><form method="post" action="register">\
//                     Enter Username:<br><input type="text" name="username">\
//                     <br>Enter Password:<br><input type="password" name="password">\
//                     <br><br><input type="submit" value="Submit"></form>';

//     res.send(form);
    
// });


// /**
//  * Lookup how to authenticate users on routes with Local Strategy
//  * Google Search: "How to use Express Passport Local Strategy"
//  * 
//  * Also, look up what behaviour express session has without a maxage set
//  */
// app.get('/protected-route', (req, res, next) => {
    
//     // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
//     if (req.isAuthenticated()) {
//         res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
//     } else {
//         res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
//     }
// });

// // Visiting this route logs the user out
// app.get('/logout', (req, res, next) => {
//     req.logout();
//     res.redirect('/protected-route');
// });

// app.get('/login-success', (req, res, next) => {
//     res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'); // actual implementation would be to go to your home page
// });

// app.get('/login-failure', (req, res, next) => {
//     res.send('You entered the wrong password.');
// });


// /*
// -----------------End of dummy frontend---------------------
// */