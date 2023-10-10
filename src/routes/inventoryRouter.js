const express = require('express');
const inventoryRouter = express();
const { getAllItems } = require('../controllers/controller');
const { tableName } = require('../models/model');


inventoryRouter.get("/", async (req, res) => {
    const inventoryArray = await getAllItems(tableName.inventory);
    res.status(200).json(inventoryArray)
});










module.exports = inventoryRouter;