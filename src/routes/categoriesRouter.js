const express = require('express');
const categoriesRouter = express.Router(); //creating a router instance

const { getAllItems,
        validateNewCategory, 
        addNewItem,
        getItem,
        updateItem} = require('../controllers/controller');
const { tableNames } = require('../models/model');
const bodyParser = require("body-parser");
const { Category } = require("../../database/models/category"); //test

const jsonParser = bodyParser.json(); //used only in specific routes

//get all categories
categoriesRouter.get("/", async (req, res, next) => {
    let categoriesArray;
    try {
        categoriesArray = await getAllItems(Category); 
    } catch (err) {
        next(err) //validate that all errs have message and status 
    }
    res.status(200).json(categoriesArray)
});

//get specific category
categoriesRouter.get("/:itemID", async (req, res, next) => {
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


//add new category
categoriesRouter.post("/", jsonParser, validateNewCategory, async (req, res, next) => {
    let addedCategory;
    const newCategory = { category_name: req.category_name }

    try {
        addedCategory = await addNewItem(Category, newCategory);
    } catch (err) {
        err.status = 400;
        next(err);
    }
    res.status(201).send(addedCategory); 
})


//update existing category
categoriesRouter.put("/:itemID", jsonParser, async (req, res, next) => {
    // passing tests, now let's refactor!
    // res.status(200).send({ id: 1, category_name: "Update Category Endpoint" })
    const itemID = req.params.itemID; //code smell, could use a general router.params thingy
    const update = req.body;
    let updatedCategory;

    try {
        updatedCategory = await updateItem(Category, itemID, update);
    } catch (err) {
        next(err);
    }

    res.status(200).send(updatedCategory);

})



const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

categoriesRouter.use(errorHandler);


module.exports = categoriesRouter;