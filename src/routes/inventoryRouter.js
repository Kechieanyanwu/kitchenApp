const express = require('express');
const { getAllFromInventory } = require('../controllers/inventory.controller');
const inventoryRouter = express();

inventoryRouter.get("/", async (req, res) => {
    const inventoryArray = await getAllFromInventory();
    res.status(200).json(inventoryArray)
});










module.exports = inventoryRouter;