const getAllFromDatabase = async (pool) => {
    const client = await pool.connect();  
    var result;
    try {
        result = await client.query(
            'SELECT * FROM checklist'
        );
    } catch (error) {
        //throw it back to the calling function 
        throw error; //how to handle specific types of errors? Probably in future iteration
    };
    const checklist = result.rows;
    client.release();
    // console.log("Categories from Database function is: ", categories); //test
    return checklist; 
}

module.exports = { getAllFromDatabase }