const express = require('express');
const checklistRouter = express();
const { getAllItems } = require('../controllers/controller');
const { tableName } = require('../models/model');


checklistRouter.get("/", async (req, res) => {
    const checklistArray = await getAllItems(tableName.checklist);
    res.status(200).json(checklistArray);
});










module.exports = checklistRouter;