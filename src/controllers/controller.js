const model = require("../models/model"); //you can't destructure imported modules with sinon stubs
const { pool } = require("../models/dbConfig"); 
const { tableNames } = require("../models/model");

//importing the tables to update. Do i import this here, or in the calling file?

const { Inventory } = require("../../database/models/inventory"); //to move to the respective router
const { sequelize } = require("../../database/models");

const noTableError = new Error("no table specified");
const nonExistentTableError = new Error("table does not exist");

//version with managed transactions WIP
const getAllItems = async (modelName) => {
        var items;
        try {
            const result = await sequelize.transaction(async (t) => {
                items = await modelName.findAll(
                { raw: true }, 
                { transaction: t }); 
                return items;
            })
            return result;
        } catch (error) {
            throw error;
    }
}


// previous version without transactions
// const getAllItems = async (modelName) => {
//     var items;
//     try {
//         items = await modelName.findAll({ raw: true }) 
//     } catch (error) {
//         throw error;
//     }
//     return items
// }

//new version using managed transactions
const addNewItem = async(tableName, requestBody) => {

    validateTableName(tableName.name); 

    const newItem = requestBody; //using this for now to test
    var addedItem;
    
    try {
        const result = sequelize.transaction(async (t) => {
            addedItem = await tableName.create(newItem, { transaction: t });
            return addedItem.dataValues
        })
        return result;
    } catch (err) {
        throw err;
    }


}


// previous version with unmanaged transactions
// const addNewItem = async(tableName, requestBody) => {

//     validateTableName(tableName.name); 

//     // const newItem = buildNewItem(requestBody); took build new item out
//     const newItem = requestBody; //using this for now to test
//     var addedItem;
    
//     // calling addToDB with the new item
//     try {
//         addedItem = await tableName.create(newItem);
//     } catch (err) {
//         throw err;
//     }

//     return addedItem.dataValues
// }

//might take this away
const buildNewItem = (requestBody) => {
    //initialize an empty object
    var newItem = {}; 
    
    //loop through each key in the requestBody and build the newItem object
     for (const key in requestBody) {
        //build the field names for newItem, separated by commas
        newItem.columns = newItem.columns ? `${newItem.columns}, ${key}` : key;

        //build the values for newItem, separated by commas and enclosed in single quotes if a string
        const value = typeof requestBody[key] === "string" ? `'${requestBody[key]}'` : requestBody[key];
        newItem.values = newItem.values ? `${newItem.values}, ${value}` : value;
        } 
    return newItem;
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


module.exports = { 
    getAllItems,
    noTableError,
    nonExistentTableError,
    validateNewGroceryItem,
    validateNewCategory,
    validateTableName,
    buildNewItem,
    addNewItem,
 };
