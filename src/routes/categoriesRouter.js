const express = require('express');
const categoriesRouter = express();
const { getAllItems,
        getAllItems_New,
        validateNewCategory, 
        addNewItem} = require('../controllers/controller');
const { tableNames } = require('../models/model');
const bodyParser = require("body-parser");

const jsonParser = bodyParser.json(); //used only in specific routes


// new version using the sequelize function
categoriesRouter.get("/", async (req, res, next) => {
    let categoriesArray
    try {
        categoriesArray = await getAllItems_New("Category");
    } catch (err) {
        next(err) //validate that all errs have message and status 
    }
    res.status(200).json(categoriesArray)
});


// previous
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