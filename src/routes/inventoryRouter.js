const express = require('express');
const inventoryRouter = express();

inventoryRouter.get("/", (req, res) => {
    res.status(200).json("Inventory endpoint")
});










module.exports = inventoryRouter;