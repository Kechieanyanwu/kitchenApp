const { getAllFromDatabase } = require("../models/model");
const { pool } = require("../models/dbConfig"); 



const getAllCategories = async () => {
    const categories = await getAllFromDatabase(pool, "categories");
    return categories  //using TDD so improving
    // will include error handling 
}



module.exports = { getAllCategories };