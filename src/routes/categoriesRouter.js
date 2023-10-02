const express = require('express');
const categoriesRouter = express();

categoriesRouter.get("/", (req, res) => {
    res.status(200).json("Categories endpoint")
});










module.exports = categoriesRouter;