const { tableNames } = require("../models/model");
const { sequelize } = require("../../database/models");

const noTableError = new Error("no table specified");
const nonExistentTableError = new Error("table does not exist");

const getAllItems = async (modelName) => {
    //to update to not return data and time 
        try {
            const result = await sequelize.transaction(async (t) => {
                const items = await modelName.findAll(
                { raw: true }, 
                { transaction: t }); 
                return items;
            })
            return result;
        } catch (error) {
            throw error;
    }
}

const getItem = async (modelName, itemID) => {
    console.log("ItemID", itemID); //test
    validateModelName(modelName.name); //is there a better place to do this? 

    try{
        const result = await sequelize.transaction(async (t) => {
            const requestedItem = await modelName.findByPk(itemID, 
                { attributes: {exclude: ["date_created", "date_updated"]},
                transaction: t })
            if (requestedItem === null) {
                throw new Error("Nonexistent item");
            } else {
                return requestedItem.dataValues;
            }
        })
        return result;
    } catch (err) {
        throw err;
    }
}


const addNewItem = async(modelName, requestBody) => {

    validateModelName(modelName.name); 

    const newItem = requestBody; //using this for now to test
    
    try {
        const result = await sequelize.transaction(async (t) => {
            const addedItem = await modelName.create(newItem, 
                { attributes: { exclude: ["date_created", "date_updated"] }, transaction: t, });
                console.log("addedItem", addedItem); //test
                return addedItem.dataValues
                //testing why i cant exclude date created and date updated
        })
        console.log("addnewitem" ,result); //test
        return result;
    } catch (err) {
        throw err;
    }


}



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

const validateModelName = (modelName) => {
    if (modelName === "" || modelName === undefined) {      //throw error if no table name is specified
        throw noTableError;
    } else {
        if (tableNames.hasOwnProperty(modelName)) {     //validate that table name exists 
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
    validateModelName,
    buildNewItem,
    addNewItem,
    getItem,
 };
