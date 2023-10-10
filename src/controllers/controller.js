const model = require("../models/model"); //you can't destructure imported modules with sinon stubs
const { pool } = require("../models/dbConfig"); 



const getAllItems = async (tableName) => {
    const items = await model.getAllFromDatabase(pool, tableName); //you can't destructure imported modules with sinon stubs
    return items  //using TDD so improving
    // will include error handling 
}



module.exports = { getAllItems };