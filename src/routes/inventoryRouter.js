const express = require('express');
const inventoryRouter = express();
const { getAllItems,
        validateNewGroceryItem } = require('../controllers/controller');
const { tableNames } = require('../models/model');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json(); //used only in specific routes


inventoryRouter.get("/", async (req, res, next) => {
    const inventoryArray = await getAllItems(tableNames.inventory);
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