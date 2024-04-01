/* eslint-disable no-undef */
require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
app.use(cors());

app.use(express.json()); 
app.use(express.urlencoded({extended: true })); 

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('../database/models');

const categoriesRouter = require('./routes/categoriesRouter'); 
const checklistRouter = require('./routes/checklistRouter');
const inventoryRouter = require('./routes/inventoryRouter') ; 
const userRouter = require('./routes/userRouter');

const isAuth = require('../utilities/authMiddleware');

const passport = require('passport');
require('../config/passport');

const sessionStore = new SequelizeStore({
    db: sequelize,
});

sessionStore.sync( {force: false} ); 

app.use(session({
    secret: process.env.SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
     }
}));

app.use(passport.initialize()); //on reach http request, runs to get userID and populate the user object
app.use(passport.session()); //on reach http request, runs to get userID and populate the user object


app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
})


app.use("/categories", categoriesRouter);
app.use("/checklist", checklistRouter);
app.use("/inventory", inventoryRouter);
app.use("/user", userRouter);

app.get('/protected-route', isAuth, (req, res) => {
    res.send(`
            <h1>You made it to the route.</h1><br>
            <a href="/logout">Logout</a>`);
});

app.get('/login-success', (req, res) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

app.get('/login-failure', (req, res) => {
    res.send('You entered the wrong password.');
});


app.get("/login", async (req, res) => {
    res.status(200).send(
        `<form action="/login" method="post">
            <label for="email">Email:</label><br>    
            <input type="email" id="email" name="email"></input><br>
            <label for="password">Password:</label><br>    
            <input type="password" id="password" name="password"></input><br>
            <input type="submit" value="Submit"></input>
        </form>`      
    
    )
})

app.get("/", (req, res) => {
    res.status(200).send("<h1>Hello World</h1>");
})

app.get('/logout', (req, res) => {
    req.logout(()=>console.log("logged out"));
    res.redirect('/protected-route');
});

app.post("/login", passport.authenticate("local", { failureRedirect: '/login-failure', successRedirect: 'login-success' }))

const server = app.listen(PORT, () => { 
    console.log(`Kitchen App is listening on port ${PORT}`)
});


module.exports = {
    app,
    server,
};