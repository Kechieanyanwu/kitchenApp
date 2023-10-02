const express = require('express');
const checklistRouter = express();

checklistRouter.get("/", (req, res) => {
    res.status(200).json("Checklist endpoint")
});










module.exports = checklistRouter;