const express = require('express');
const inventoryRouter = express();
const { getAllItems,
        validateNewGroceryItem } = require('../controllers/controller');
const { tableNames } = require('../models/model');
const bodyParser = require("body-parser");
const { Inventory } = require('../../database/models/inventory');
const jsonParser = bodyParser.json(); //used only in specific routes


// new version using the sequelize function
inventoryRouter.get("/", async (req, res, next) => {
    let inventoryArray
    try {
        inventoryArray = await getAllItems(Inventory);
    } catch (err) {
        next(err) //validate that all errs have message and status 
    }
    res.status(200).json(inventoryArray)
});


inventoryRouter.post("/", jsonParser, validateNewGroceryItem, async (req, res, next) => {
        res.status(201).send("Request processed successfully");
})








const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

inventoryRouter.use(errorHandler);


module.exports = inventoryRouter;