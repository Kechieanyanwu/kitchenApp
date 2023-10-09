const express = require('express');
const { getAllChecklist } = require('../controllers/checklist.controller');
const checklistRouter = express();

// Note, router doesnt know anything about the database.
// Sp getAllChecklist doesnt take a pool. Rather, the database calling function in it does
checklistRouter.get("/", async (req, res) => {
    // const checklist =  [//returns a list of checklist items
    //         { id: 1, item_name: "milk", quantity: 1, category_id: 1, purchased: false},
    //         { id: 2, item_name: "berries", quantity: 3, category_id: 2}
    //     ]
    const checklistArray = await getAllChecklist();
    res.status(200).json(checklistArray);
});










module.exports = checklistRouter;