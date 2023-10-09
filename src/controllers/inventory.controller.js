const { getAllFromDatabase } = require("../models/model");
const { pool } = require("../models/dbConfig"); 

const getAllFromInventory = async () => {
    const inventory = await getAllFromDatabase(pool, "inventory");
    return inventory
}

module.exports = { getAllFromInventory };