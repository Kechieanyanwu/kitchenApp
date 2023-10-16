const express = require('express');
const app = express();
const PORT = process.env.PORT || 4002
const categoriesRouter = require('./routes/categoriesRouter') 
const checklistRouter = require('./routes/checklistRouter')
const inventoryRouter = require('./routes/inventoryRouter') 
const bodyParser = require("body-parser"); //last thing you imported

app.get("/", (req, res) => {
    res.status(200).json("Hello World")
});

categoriesRouter.use(bodyParser.json()); //should this be here? 

app.use("/categories", categoriesRouter);
app.use("/checklist", checklistRouter);
app.use("/inventory", inventoryRouter);

const server = app.listen(PORT, () => { //added in server variable
    console.log(`Kitchen App is listening on port ${PORT}`)
});


module.exports = { //exported new server variable
    app,
    server,
}; // Export the Express app 