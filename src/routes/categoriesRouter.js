const express = require('express');
const categoriesRouter = express();
const { getAllItems,
        validateNewCategory, 
        addNewItem,
        getItem} = require('../controllers/controller');
const { tableNames } = require('../models/model');
const bodyParser = require("body-parser");
const { Category } = require("../../database/models/category"); //test

const jsonParser = bodyParser.json(); //used only in specific routes


categoriesRouter.get("/", async (req, res, next) => {
    let categoriesArray;
    try {
        categoriesArray = await getAllItems(Category); 
    } catch (err) {
        next(err) //validate that all errs have message and status 
    }
    res.status(200).json(categoriesArray)
});

//get specific item

categoriesRouter.get("/:itemID", async (req, res, next) => {
    //to pass test. will refactor
    // res.status(200).send({ id: 3, category_name: "Cleaning" })
    const itemID = req.params.itemID;
    let category;
    try {
        category = await getItem(Category, itemID) //testing sending no transaction T
    } catch (err) {
        err.status = 400;
        next(err);
    }
    res.status(200).send(category)
})


//currently working on making this actually call the addNewItem function 
categoriesRouter.post("/", jsonParser, validateNewCategory, async (req, res, next) => {
    var response;

    // console.log(req.body); //test
    // try {
    //     response = await addNewItem(tableNames.categories, req.body);
    // } catch (err) {
    //     err.status = 500;
    //     next(err);
    // }
    res.status(201).send(response); 
})





const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

categoriesRouter.use(errorHandler);


module.exports = categoriesRouter;