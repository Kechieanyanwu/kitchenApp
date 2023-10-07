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
        throw error; //how to handle specific types of errors? Probably in future iteration

        // IF RETURNING AN ERROR, BELOW
        // return error; //how to handle specific types of errors? Probably in future iteration
    };
    const categories = result.rows;
    client.release();
    // console.log("Categories from Database function is: ", categories); //test
    return categories; 
}

module.exports = { getAllFromDatabase };


/*
Question is how to handle errors? Am i to handle from the very first thing, client.query? Do I test from getAllFromDatabase
or from the controller file?
Do i not handle errors here at all? I.e. am I testing result handling too early (see line 115 in server_test)
Should I instead test a higher function, that an error comes all the way through? 
*/