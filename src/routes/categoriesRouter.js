const express = require('express');
const categoriesRouter = express();
const { getAllItems } = require('../controllers/controller');
const { tableName } = require('../models/model');


categoriesRouter.get("/", async (req, res) => {
    const categoriesArray = await getAllItems(tableName.categories);
    res.status(200).json(categoriesArray)
});






module.exports = categoriesRouter;