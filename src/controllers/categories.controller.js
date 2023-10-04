const { getAllFromDatabase } = require("../models/categoriesModel");
const { pool } = require("../models/dbConfig"); 

const testCategories = [{ //test
    id: 1,
    category_name: "Fruit"
},
{
    id: 2,
    category_name: "Grains"
},
];

const getAllCategories = async () => {
    const categories = await getAllFromDatabase(pool);
    return categories  //using TDD so improving
    // will include error handling 
}



module.exports = { getAllCategories };