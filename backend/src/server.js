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

app.use(passport.initialize()); //to know how this is working
app.use(passport.session()); //to know how this is working


app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
})


app.use("/categories", categoriesRouter);
app.use("/checklist", checklistRouter);
app.use("/inventory", inventoryRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.status(200).send("<h1>Hello World</h1>");
})

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

app.post("/login", passport.authenticate("local"), async (req, res) => {
    if (req.user) {
        //to add header 
        console.log(req.user);
        // console.log(res);
        res.status(200).send("<h1>Authenticated!</h1>");
    } else {
        res.status(401).send("<h1>Unauthorized</h1>");
    }
})


const server = app.listen(PORT, () => { 
    console.log(`Kitchen App is listening on port ${PORT}`)
});


module.exports = {
    app,
    server,
};