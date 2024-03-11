require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
app.use(cors());


const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const { sequelize } = require('../database/models')

// const passport = require('passport');


const categoriesRouter = require('./routes/categoriesRouter'); 
const checklistRouter = require('./routes/checklistRouter');
const inventoryRouter = require('./routes/inventoryRouter') ; 
const userRouter = require('./routes/userRouter');

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

// require('../config/passport');


// app.use(passport.initialize());
// app.use(passport.session());

//might need to move all session stuff here

app.use("/categories", categoriesRouter);
app.use("/checklist", checklistRouter);
app.use("/inventory", inventoryRouter);
app.use("/user", userRouter);

app.get("/", (req, res, next) => {
    res.status(200).send("<h1>Hello World</h1>");
})






const server = app.listen(PORT, () => { 
    console.log(`Kitchen App is listening on port ${PORT}`)
});


module.exports = {
    app,
    server,
};