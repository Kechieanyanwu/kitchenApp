const express = require('express');
const categoriesRouter = express();
const { getAllCategories } = require("../controllers/categories.controller");


categoriesRouter.get("/", async (req, res) => {
    const categoriesArray = await getAllCategories();
    res.status(200).json(categoriesArray)
});






module.exports = categoriesRouter;