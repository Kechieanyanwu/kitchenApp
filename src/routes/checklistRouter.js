const express = require('express');
const checklistRouter = express();
const { getAllItems } = require('../controllers/controller');
const { tableNames } = require('../models/model');


checklistRouter.get("/", async (req, res) => {
    const checklistArray = await getAllItems(tableNames.checklist);
    res.status(200).json(checklistArray);
});










module.exports = checklistRouter;