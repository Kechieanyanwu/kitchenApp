const express = require('express');
const checklistRouter = express.Router(); //creating a router instance 
const { getAllItems,
        validateNewGroceryItem, 
        getItem,
        addNewItem} = require('../controllers/controller');
const { tableNames } = require('../models/model');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json(); //used only in specific routes

const { Checklist } = require("../../database/models/checklist"); 


checklistRouter.get("/", async (req, res, next) => {
    let checklistArray
    try {
        checklistArray = await getAllItems(Checklist);
    } catch (err) {
        next(err) //validate that all errs have message and status 
    }
    res.status(200).json(checklistArray)
});

//get specific item
checklistRouter.get("/:itemID", async (req, res, next) => {
    const itemID = req.params.itemID;
    let item;
    try {
        item = await getItem(Checklist, itemID) //testing sending no transaction T
    } catch (err) {
        err.status = 400;
        next(err);
    }
    res.status(200).send(item);
})


checklistRouter.post("/", jsonParser, validateNewGroceryItem, async (req, res, next) => {
    let addedItem;
    const newItem = {item_name: req.item_name, quantity: req.quantity, category_id: req.category_id};

    try {
        addedItem = await addNewItem(Checklist, newItem);
    } catch (err) {
        err.status = 400;
        next(err);
    }
    res.status(201).send(addedItem)
})


    //assertion that when checklist is ticked off, 








const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

checklistRouter.use(errorHandler);


module.exports = checklistRouter;