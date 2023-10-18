const express = require('express');
const checklistRouter = express();
const { getAllItems } = require('../controllers/controller');
const { tableNames } = require('../models/model');
const bodyParser = require("body-parser");

const jsonParser = bodyParser.json(); //used only in specific routes

const validateNewChecklistItem = (req, res, next) => { //include validateCategoryID soon
    if (JSON.stringify(req.body) == "{}") {
        const err = new Error("Please include details of the new checklist item");
        err.status = 400;
        next(err);
    } else {
        numKeysInReq = Object.keys(req.body);
        if (req.body.item_name && req.body.quantity && req.body.category_id && (numKeysInReq.length == 3)) {
            req.item_name = req.body.item_name;
            req.quantity = req.body.quantity;
            req.category_id = req.body.category_id;
            if (typeof req.item_name === "string" && typeof req.quantity === "number" && typeof req.category_id === "number") {
                //to add validation that the category ID exists 
                next();
            } else {
                const err = new Error("Item name must be a string, quantity and category ID must be a number");
                err.status = 400; 
                next(err);
            }
        } else {
            const err = new Error("Checklist item must have an item name, quantity and category ID");
            err.status = 400; 
            next(err);
        }
    }
}

checklistRouter.get("/", async (req, res, next) => {
    const checklistArray = await getAllItems(tableNames.checklist);
    res.status(200).json(checklistArray);
});

checklistRouter.post("/", jsonParser, validateNewChecklistItem, async (req, res, next) => {
    // if (JSON.stringify(req.body) === "{}") {
    //     res.status(400).send() //change to thrown error
    // } else {
        res.status(201).send("Request processed successfully") //to update logic 
    // }
})



const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

checklistRouter.use(errorHandler);


module.exports = checklistRouter;