const express = require('express');
const app = express();
const PORT = process.env.PORT || 4002
const categoriesRouter = require('./routes/categoriesRouter') //last thing you imported

app.get("/", (req, res) => {
    res.status(200).json("Hello World")
});

app.use("/categories", categoriesRouter);

app.listen(PORT, () => {
    console.log(`Kitchen App is listening on port ${PORT}`)
});


module.exports = app; // Export the Express app 