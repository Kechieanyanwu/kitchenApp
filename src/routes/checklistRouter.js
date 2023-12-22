const express = require('express');
const checklistRouter = express.Router(); //creating a router instance 
const { getAllItems,
        validateNewGroceryItem, 
        getItem,
        addNewItem,
        updateItem,
        deleteItem} = require('../controllers/controller');
const { tableNames } = require('../models/model');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json(); //used only in specific routes

const { Checklist } = require("../../database/models/checklist"); 
const { sequelize } = require('../../database/models');
const { Inventory } = require('../../database/models/inventory');

//get all checklist items
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

//add new checklist item
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


//update existing checklist item
checklistRouter.put("/:itemID", jsonParser, async (req, res, next) => {

    const itemID = req.params.itemID; //code smell, could use a general router.params thingy
    const update = req.body;
    let updatedItem;

    if (update.purchased === true ) { //if this item has been marked as purchased
        console.log("You have been bought with a price"); //test
        try {
            //do I create a transaction here because multiple things happening?
            const newItem = req.body;
            delete newItem.purchased;
            await deleteItem(Checklist, itemID);
            await addNewItem(Inventory, newItem);
            res.status(200).send("Item is now in inventory");
        } catch (err) {
            throw (err);
        }
    } else {
        try {
            updatedItem = await updateItem(Checklist, itemID, update);
        } catch (err) {
            next(err);
        }
        res.status(200).send(updatedItem);
    }
})







const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

checklistRouter.use(errorHandler);


module.exports = checklistRouter;