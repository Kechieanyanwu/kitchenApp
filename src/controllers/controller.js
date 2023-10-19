const model = require("../models/model"); //you can't destructure imported modules with sinon stubs
const { pool } = require("../models/dbConfig"); 
const { tableNames } = require("../models/model");

const noTableError = new Error("no table specified");
const nonExistentTableError = new Error("table does not exist");

const validateTableName = (tableName) => {
    if (tableName === "" || tableName === undefined) {      //throw error if no table name is specified
        throw noTableError;
    } else {
        if (tableNames.hasOwnProperty(tableName)) {     //validate that table name exists 
            return;
        } else {
            throw nonExistentTableError;
        }
    }
}

const getAllItems = async (tableName) => {
    validateTableName(tableName);

    var items;
    try {
        items = await model.getAllFromDatabase(pool, tableName); //you can't destructure imported modules with sinon stubs
    } catch (error) {
        throw error;
    }
    return items
}






//CURRENTLY WIP 
const addNewItem = async(tableName, requestBody) => {

    //takes request object item
    //separates the object into the fields and the values
    //builds the new item query and sends to add to database
    // try {
    //const response = await addToDatabase(pool, tableName, newItemQuery)
    // } catch (err) {
    //     throw err;
    // }

}

const validateNewGroceryItem = (req, res, next) => { //include validateCategoryID soon
    if (JSON.stringify(req.body) == "{}") {
        const err = new Error("Please include details of the new checklist item");
        err.status = 400;
        next(err);
    } else {
        numKeysInReq = Object.keys(req.body);
        if (req.body.item_name && req.body.quantity && req.body.category_id && (numKeysInReq.length == 3)) {
            req.item_name = req.body.item_name;
            req.quantity = req.body.quantity;
            req.category_id = req.body.category_id;
            if (typeof req.item_name === "string" && typeof req.quantity === "number" && typeof req.category_id === "number") {
                //to add validation that the category ID exists 
                next();
            } else {
                const err = new Error("Item name must be a string, quantity and category ID must be a number");
                err.status = 400; 
    
                next(err);
            }
        } else {
            const err = new Error("Checklist item must have an item name, quantity and category ID");
            err.status = 400; 

            next(err);
        }
    }
};

const validateNewCategory = (req, res, next) => {
    if (JSON.stringify(req.body) == "{}") { //if an empty request body
        const err = new Error("Please include a category name");
        err.status = 400;
        next(err);
    } else {
        numKeysInReq = Object.keys(req.body);
        if (req.body.category_name && (numKeysInReq.length == 1)) { //if there is just one key called category_name
            if (typeof req.body.category_name === "string") { //if the category name is a string
                req.category_name = req.body.category_name;
                next(); //go on to the next part of the middleware
            } else {
                const err = new Error("Category name must be a string");
                err.status = 400;
                next(err);
            }
        } else {
            const err = new Error("Request must only contain a category name");
            err.status = 400;
            next(err);

        }

    }
};


module.exports = { 
    getAllItems,
    noTableError,
    nonExistentTableError,
    validateNewGroceryItem,
    validateNewCategory,
 };

 // const validateTableName = (tableName) => {
//     if (tableName === "" || tableName === undefined) {      //throw error if no table name is specified
//         throw noTableError;
//     } else {
//         if (tableNames.hasOwnProperty(tableName)) {     //validate that table name exists 
//             return true;
//         } else {
//             throw nonExistentTableError;
//         }
//     }
// }

// const getAllItems = async (tableName) => {
//     try {
//         const tableExists = validateTableName(tableName);
//     } catch (err) {
//         throw err;
//     }

//     var items;
//     try {
//         items = await model.getAllFromDatabase(pool, tableName); //you can't destructure imported modules with sinon stubs
//     } catch (error) {
//         throw error;
//     }
//     return items
// }