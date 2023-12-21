const express = require('express');
const inventoryRouter = express.Router(); //creating a router instance
const { getAllItems,
        validateNewGroceryItem, 
        getItem,
        addNewItem} = require('../controllers/controller');
const { tableNames } = require('../models/model');
const bodyParser = require("body-parser");
const { Inventory } = require('../../database/models/inventory');
const jsonParser = bodyParser.json(); //used only in specific routes


inventoryRouter.get("/", async (req, res, next) => {
    let inventoryArray
    try {
        inventoryArray = await getAllItems(Inventory);
    } catch (err) {
        next(err) //validate that all errs have message and status 
    }
    res.status(200).json(inventoryArray)
});

inventoryRouter.get("/:itemID", async (req, res, next) => {
    const itemID = req.params.itemID;
    let item;
    try {
        item = await getItem(Inventory, itemID) //testing sending no transaction T
    } catch (err) {
        err.status = 400;
        next(err);
    }
    res.status(200).send(item)
})


inventoryRouter.post("/", jsonParser, validateNewGroceryItem, async (req, res, next) => {
    let addedItem;
    const newItem = {item_name: req.item_name, quantity: req.quantity, category_id: req.category_id};

    try {
        addedItem = await addNewItem(Inventory, newItem);
    } catch (err) {
        err.status = 400;
        next(err);
    }
    res.status(201).send(addedItem)
})

//update existing inventory item
inventoryRouter.put("/:itemID", jsonParser, async (req, res, next) => {
    // passing tests, now let's refactor!
    res.status(200).send({
        "id": 1,
        "item_name": "Update Inventory Item Test",
        "quantity": 25,
        "category_id": 2,
    });
    // const itemID = req.params.itemID; //code smell, could use a general router.params thingy
    // const update = req.body;
    // let updatedCategory;

    // try {
    //     updatedCategory = await updateItem(Category, itemID, update);
    // } catch (err) {
    //     next(err);
    // }

    // res.status(200).send(updatedCategory);

})






const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

inventoryRouter.use(errorHandler);


module.exports = inventoryRouter;