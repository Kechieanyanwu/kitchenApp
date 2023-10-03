const { getAllFromDatabase } = require("../models/categoriesModel");
const { pool } = require("../models/dbConfig"); 

const testCategories = [{ //might be better to also move this to the model file and export 
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