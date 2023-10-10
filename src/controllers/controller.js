const { getAllFromDatabase } = require("../models/model");
const { pool } = require("../models/dbConfig"); 



const getAllItems = async (tableName) => {
    const items = await getAllFromDatabase(pool, tableName);
    return items  //using TDD so improving
    // will include error handling 
}



module.exports = { getAllItems };