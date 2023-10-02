const express = require('express');
const categoriesRouter = express();


categoriesRouter.get("/", (req, res) => {
    res.status(200).json(categoriesArray) //using TDD so will 
});




const categoriesArray = [{ //might be better to also move this to the model file and export 
    id: 1,
    category_name: "Fruit"
},
{
    id: 2,
    category_name: "Grains"
},
];






module.exports = categoriesRouter;