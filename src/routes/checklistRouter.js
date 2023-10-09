const express = require('express');
const { getAllChecklist } = require('../controllers/checklist.controller');
const checklistRouter = express();

// Note, router doesnt know anything about the database.
// So getAllChecklist doesnt take a pool. Rather, the database calling function in it does
checklistRouter.get("/", async (req, res) => {
    const checklistArray = await getAllChecklist();
    res.status(200).json(checklistArray);
});










module.exports = checklistRouter;