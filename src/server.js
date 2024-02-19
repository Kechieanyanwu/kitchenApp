require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const { sequelize } = require('../database/models')

const categoriesRouter = require('./routes/categoriesRouter'); 
const checklistRouter = require('./routes/checklistRouter');
const inventoryRouter = require('./routes/inventoryRouter') ;
const userRouter = require('./routes/userRouter');

const sessionStore = new SequelizeStore({
    db: sequelize,
})

app.use(session({
    secret: 'apple-banana',
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
     }
}));

sessionStore.sync();

app.use("/categories", categoriesRouter);
app.use("/checklist", checklistRouter);
app.use("/inventory", inventoryRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => { // dummy frontend
    // res.status(200).json("Hello World");
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:PORT/login, you will see "Login Page"
app.get('/login', (req, res, next) => { // dummy frontend
   
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

// When you visit http://localhost:PORT/register, you will see "Register Page"
app.get('/register', (req, res, next) => { // dummy frontend

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
    
});
// todo
app.post("/login", (req, res, next) => {}) //take email and pwd

// todo
app.post("/register", (req, res, next) => {})

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
app.get('/protected-route', (req, res, next) => {
    
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
    } else {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    }
});

// Visiting this route logs the user out
app.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

app.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'); // actual implementation would be to go to your home page
});

app.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});




const server = app.listen(PORT, () => { 
    console.log(`Kitchen App is listening on port ${PORT}`)
});


module.exports = {
    app,
    server,
};