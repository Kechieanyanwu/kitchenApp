const express = require('express');
const inventoryRouter = express();
const { getAllItems } = require('../controllers/controller');
const { tableNames } = require('../models/model');


inventoryRouter.get("/", async (req, res) => {
    const inventoryArray = await getAllItems(tableNames.inventory);
    res.status(200).json(inventoryArray)
});










module.exports = inventoryRouter;