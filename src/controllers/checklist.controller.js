const { getAllFromDatabase } = require("../models/checklistModel")
const { pool } = require("../models/dbConfig") //our database pool 

const getAllChecklist = async () => {
    const checklist = await getAllFromDatabase(pool);
    return checklist;
    //to include error handling when testing this endpoint
    //i.e. include try catch loop here for thrown errorsa

}

module.exports = { getAllChecklist }