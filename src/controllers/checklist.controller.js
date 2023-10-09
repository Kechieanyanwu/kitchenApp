const { getAllFromDatabase } = require("../models/model")
const { pool } = require("../models/dbConfig") //our database pool 

const getAllChecklist = async () => {
    const checklist = await getAllFromDatabase(pool, "checklist");
    return checklist;

    //to include error handling when testing this endpoint
    //i.e. include try catch loop here for thrown errors

}

module.exports = { getAllChecklist }