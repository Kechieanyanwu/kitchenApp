// Model and Sequelize Imports
const { tableNames } = require("../models/model");
const { sequelize } = require("../../database/models"); // might eventually call this when creating transaction variable

// Errors
const noTableError = new Error("no table specified");
const nonExistentTableError = new Error("table does not exist");
const nonExistentItemError = new Error("Nonexistent item")


//REMEMBER TO PASS TRANSACTION T INTO EVERY SEQUELIZE CALL
//WILL UPDATE THIS TO USE CLS IF VIBE DEY
//will have to read up some more on transactions to see if i need to pass

//do I want there to be a separate checkItem endpoint? Or do I just want it as an update? 


// Beginning of functions
const getAllItems = async (modelName, t ) => {
    validateModelName(modelName.name); //to be moved to the router files
    //I WANT TO ADD A CHECK FOR WHETHER THERE IS A T BEING PASSED, IF NOT, I CREATE A NEW TRANSACTION
    // I think I'll add this when I integrate to the routers
    // if (t == null) {
    //     t = await sequelize.transaction(); t=null
    // }
        try {
                const items = await modelName.findAll(
                { raw: true,  transaction: t }); 
                // { transaction: t }); 
                return items;
        } catch (error) {
            throw error;
    }
}

const getItem = async (modelName, itemID, t) => {
    validateModelName(modelName.name); //to be moved to the router files
    try{
            const requestedItem = await modelName.findByPk(itemID, 
                { attributes: {exclude: ["date_created", "date_updated"]},
                transaction: t })
            if (requestedItem === null) {
                throw nonExistentItemError;
            } else {
                return requestedItem.dataValues;
            }
    } catch (err) {
        throw err;
    }
}


const addNewItem = async(modelName, newItem, t) => {
    validateModelName(modelName.name); //to be moved to the router files
    
    try {
        const addedItem = await modelName.create(newItem, 
            { transaction: t }); //seems you can't exclude columns on create, only on return, so will have to delete date columns
        
        // remove these columns from result
        delete addedItem.dataValues.date_created;
        delete addedItem.dataValues.date_updated;
        
        // return new item
        return addedItem.dataValues

    } catch (err) {
        throw err;
    }


}

const updateItem = async(modelName, itemID, desiredUpdate, t) => { 
    validateModelName(modelName.name); //to be moved to the router files

    try {
        // Any other way of checking for nonexistence if I just go straight to using the model to update, instead of finding first? 
        const item = await modelName.findByPk(itemID, 
            { transaction: t,
            plain: true }) //do I need plain: true everywhere? 
        //check that the itemID exists
        if (item === null) {
                throw nonExistentItemError;
        }
        //update with new details
        await item.update(desiredUpdate, { transaction: t });

        // remove these columns from result
        delete item.dataValues.date_created;
        delete item.dataValues.date_updated;

        //return updated item 
        return item.dataValues;
    } catch (err) {
        throw err;
    }
}

const deleteItem = async (modelName, itemID, t) => {
    try {
        const item = await modelName.findByPk(itemID, 
            { attributes: {exclude: ["date_created", "date_updated"]},
            transaction: t,
            plain: true }) //do I need plain: true everywhere? 
        
            //check that the itemID exists
        if (item === null) {
                throw nonExistentItemError;
        } else {
            await item.destroy({ transaction: t });
            const items = await modelName.findAll(
                { raw: true , 
                attributes: {exclude: ["date_created", "date_updated"]},
                transaction: t }); 
                return items; 
        }
    } catch (err) {
        throw err;
    }
}

const validateNewGroceryItem = (req, res, next) => { //include validateCategoryID soon
    if (JSON.stringify(req.body) == "{}") {
        const err = new Error("Empty Body");
        err.status = 400;
        next(err);
    } else {
        numKeysInReq = Object.keys(req.body);
        if (req.body.item_name && req.body.quantity && req.body.category_id && (numKeysInReq.length == 3)) {
            req.item_name = req.body.item_name;
            req.quantity = req.body.quantity;
            req.category_id = req.body.category_id;
            if (typeof req.item_name === "string" && typeof req.quantity === "number" && typeof req.category_id === "number") {
                //to add validation that the category ID exists. 20/12/23 Not adding as this will not be on the client side as an input, but a dropdown
                next();
            } else {
                const err = new Error("Item name must be a string, quantity and category ID must be a number");
                err.status = 400; 
    
                next(err);
            }
        } else {
            const err = new Error("Item must have an item name, quantity and category ID");
            err.status = 400; 

            next(err);
        }
    }
};

const validateNewCategory = (req, res, next) => {
    if (JSON.stringify(req.body) == "{}") { //if an empty request body
        const err = new Error("Empty Body");
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
    if (modelName === "" || modelName === undefined) { //throw error if no table name is specified
        throw noTableError;
    } else {
        if (tableNames.hasOwnProperty(modelName)) { //validate that table name exists 
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
    nonExistentItemError,
    validateNewGroceryItem,
    validateNewCategory,
    validateModelName,
    addNewItem,
    getItem,
    updateItem,
    deleteItem,
 };
