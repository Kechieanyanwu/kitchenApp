const model = require("../models/model"); //you can't destructure imported modules with sinon stubs
const { pool } = require("../models/dbConfig"); 
const { tableNames } = require("../models/model");

const noTableError = new Error("no table specified");
const nonExistentTableError = new Error("table does not exist");

const getAllItems = async (tableName) => {
    //throw error if no table name is specified
    if (tableName === "" || tableName === undefined) { 
        throw noTableError;
    };

    //validate that table name exists 
    if (tableNames.hasOwnProperty(tableName)) {
        var items;
        try {
            items = await model.getAllFromDatabase(pool, tableName); //you can't destructure imported modules with sinon stubs
        } catch (error) {
            throw error;
        }
        return items 
    } else {
        throw nonExistentTableError;
    }
}



module.exports = { 
    getAllItems,
    noTableError,
    nonExistentTableError,
 };