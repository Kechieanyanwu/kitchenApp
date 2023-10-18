const express = require('express');
const checklistRouter = express();
const { getAllItems,
        validateNewGroceryItem } = require('../controllers/controller');
const { tableNames } = require('../models/model');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json(); //used only in specific routes


checklistRouter.get("/", async (req, res, next) => {
    const checklistArray = await getAllItems(tableNames.checklist);
    res.status(200).json(checklistArray);
});

checklistRouter.post("/", jsonParser, validateNewGroceryItem, async (req, res, next) => {
    res.status(201).send("Request processed successfully") //to update logic 
})








const errorHandler = (err, req, res, next) => {
    res.status(err.status).send(err.message);
};

checklistRouter.use(errorHandler);


module.exports = checklistRouter;