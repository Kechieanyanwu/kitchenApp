require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
app.use(cors());

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const { sequelize } = require('../database/models')

const categoriesRouter = require('./routes/categoriesRouter'); 
const checklistRouter = require('./routes/checklistRouter');
const inventoryRouter = require('./routes/inventoryRouter') ; 
const userRouter = require('./routes/userRouter');

const passport = require('passport');
require('../config/passport');

const sessionStore = new SequelizeStore({
    db: sequelize,
})

sessionStore.sync( {force: false} ); 

app.use(session({
    secret: process.env.SECRET,
    store: sessionStore,
    resave: false,
    // saveUninitialized: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
     }
}));

app.use(passport.initialize()); //to know how this is working
app.use(passport.session()); //to know how this is working

app.use("/categories", categoriesRouter);
app.use("/checklist", checklistRouter);
app.use("/inventory", inventoryRouter);
app.use("/user", userRouter);



// app.use((req, res, next) => {
//     console.log(req.session);
//     console.log(req.user);
//     next();
// })


app.get("/", (req, res, next) => {
    res.status(200).send("<h1>Hello World</h1>");
})



app.post("/login", jsonParser, passport.authenticate("local"), async (req, res, next) => {
    if (req.user) {
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