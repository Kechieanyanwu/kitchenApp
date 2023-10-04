const express = require('express');
const categoriesRouter = express();
const { getAllCategories } = require("../controllers/categories.controller");


categoriesRouter.get("/", async (req, res) => {
    const categoriesArray = await getAllCategories();
    // console.log("The categories array is: ", categoriesArray) //test
    res.status(200).json(categoriesArray)
});






module.exports = categoriesRouter;