const express = require('express');
const categoriesRouter = express();
const { getAllItems } = require('../controllers/controller');
const { tableNames } = require('../models/model');
const bodyParser = require("body-parser");

const jsonParser = bodyParser.json(); //used only in specific routes


const validateNewCategory = (req, res, next) => {
    if (JSON.stringify(req.body) == "{}") { //if an empty request body
        const err = new Error("Please include a category name");
        err.status = 400;
        next(err);
    } else {
        numKeysInReq = Object.keys(req.body);
        if (req.body.category_name && (numKeysInReq.length == 1)) { //if there is just one key called category_name
            if (typeof req.body.category_name === "string") { //if the category name is a string
                req.category_name = req.body.category_name;
                next(); //go on to the next part of the middleware
            } else {
                const err = new Error("Category name must be a string");
                err.status = 400;
                next(err);
            }
        } else {
            const err = new Error("Request must only contain a category name");
            err.status = 400;
            next(err);

        }

    }
}


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


categoriesRouter.post("/", jsonParser, validateNewCategory, (req, res, next) => {
    console.log("This is the category name", req.category_name); //test
    res.status(201).send("Request processed successfully"); //add logic 
    //modify to send created item? 
})





const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

categoriesRouter.use(errorHandler);


module.exports = categoriesRouter;