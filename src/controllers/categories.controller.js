const testCategories = [{ //might be better to also move this to the model file and export 
    id: 1,
    category_name: "Fruit"
},
{
    id: 2,
    category_name: "Grains"
},
];

const getAllCategories = () => {
    // const testCategories = getAllFromDatabase();
    return testCategories  //using TDD so improving
    // maybe getAllFromDatabase
}

// Steps for tomorrow
    // Set up database 
    // Will now start interacting with model file
    // Setting up the database, and including tables


module.exports = { getAllCategories };