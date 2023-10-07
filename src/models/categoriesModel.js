// const pool = require("../models/dbConfig"); 
// might not need this here if i pass in dependency
//from controller file 


/*
i'll most likely end up replicating this function across all tables, 
I could just add the table name as a parameter in future
*/
const getAllFromDatabase = async (pool) => { 
    const client = await pool.connect();  
    var result;
    try {
        result = await client.query(
            'SELECT * FROM categories'
        );
    } catch (error) {
        // console.log("Error: ", error) //test
        return error; //how to handle specific types of errors? Probably in future iteration
    };
    const categories = result.rows;
    client.release();
    // console.log("Categories from Database function is: ", categories); //test
    return categories; 
}

module.exports = { getAllFromDatabase };


// Old note to consolidate in readme process. Ignore below
/*noticing that what I currently have isnt dependency injection since I actuall pass in db.config
How do I avoid this? I think I will only describe the function and dependency here and 
implement in the controller section. 
*/