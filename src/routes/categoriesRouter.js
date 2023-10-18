const express = require('express');
const categoriesRouter = express();
const { getAllItems,
        validateNewCategory } = require('../controllers/controller');
const { tableNames } = require('../models/model');
const bodyParser = require("body-parser");

const jsonParser = bodyParser.json(); //used only in specific routes


categoriesRouter.get("/", async (req, res, next) => {
    let categoriesArray
    try {
        categoriesArray = await getAllItems(tableNames.categories);
    } catch (err) {
        next(err) //validate that all errs have message and status 
    }
    res.status(200).json(categoriesArray)
});

//get specific item


categoriesRouter.post("/", jsonParser, validateNewCategory, async (req, res, next) => {
    //to add try catch loop
    // const response = await addNewItem(categories, req.body) //it is inside addNewItem that we transform to query to be sent
    res.status(201).send("Request processed successfully"); //add logic 
    //modify to send created item? 
})





const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

categoriesRouter.use(errorHandler);


module.exports = categoriesRouter;