const express = require('express');
const categoriesRouter = express();
const { getAllCategories } = require("../controllers/categories.controller");


categoriesRouter.get("/", (req, res) => {
    const categoriesArray = getAllCategories();
    res.status(200).json(categoriesArray)
});






module.exports = categoriesRouter;