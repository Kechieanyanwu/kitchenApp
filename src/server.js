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

app.get("/", (req, res) => {
    res.status(200).json("Hello World")
});

const server = app.listen(PORT, () => { 
    console.log(`Kitchen App is listening on port ${PORT}`)
});


module.exports = {
    app,
    server,
};