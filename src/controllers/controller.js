// Model and Sequelize Imports
const { sequelize } = require("../../database/models"); // might eventually call this when creating transaction variable
const { Checklist } = require("../../database/models/checklist");
const { Inventory } = require("../../database/models/inventory");

// Errors
const nonExistentItemError = new Error("Nonexistent item")


//REMEMBER TO PASS TRANSACTION T INTO EVERY SEQUELIZE CALL
//WILL UPDATE THIS TO USE CLS IF VIBE DEY
//will have to read up some more on transactions to see if i need to pass

//do I want there to be a separate checkItem endpoint? Or do I just want it as an update? 


// Beginning of functions
const getAllItems = async (modelName, t ) => {
    //I WANT TO ADD A CHECK FOR WHETHER THERE IS A T BEING PASSED, IF NOT, I CREATE A NEW TRANSACTION
    // I think I'll add this when I integrate to the routers
    // if (t === null) {
    //     t = await sequelize.transaction();
    // }
    // t===null? t = await sequelize.transaction(): t; //test

        try {
                const items = await modelName.findAll(
                // { raw: true, transaction: t }); 
                { raw: true, attributes: {exclude: ["date_created", "date_updated"]}, transaction: t }); 
                // { transaction: t }); 
                return items;
        } catch (error) {
            throw error;
    }
}

const getItem = async (modelName, itemID, t) => {

    // t===null? t = await sequelize.transaction(): t; //test

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

    // t===null? t = await sequelize.transaction(): t; //test
    
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

    // t===null? t = await sequelize.transaction(): t; //test
    let item;
    try {
        item = await validateID(itemID, modelName, t)
    } catch (err) {
        throw err;
    }

    await item.update(desiredUpdate, { transaction: t });

    // remove these columns from result
    delete item.dataValues.date_created;
    delete item.dataValues.date_updated;

    //return updated item 
    return item.dataValues;

}

const deleteItem = async (modelName, itemID, t) => {
    // t===null? t = await sequelize.transaction(): t; //test

    let item;
    try {
        item = await validateID(itemID, modelName, t)
    } catch (err) {
        throw err;
    }

    await item.destroy({ transaction: t });

    const items = await modelName.findAll(
        {
            raw: true,
            attributes: { exclude: ["date_created", "date_updated"] },
            transaction: t
        });
    return items; 
}

const moveCheckedItem = async (itemID, t) => {
    //will I need to create a transaction here since multiple things are happening? 
    
    let item;
    try {
        item = await validateID(itemID, Checklist, t)
    } catch (err) {
        throw err;
    }

    newItem = item.get({ transaction: t });

    //remove unnecessary values
    delete newItem.id;
    delete newItem.purchased;
    
    //add to inventory table
    await Inventory.create(newItem, { transaction: t });

    await Checklist.destroy({ where: { id: itemID }, transaction: t })
    
    const updatedChecklist = await Checklist.findAll(
        { attributes: { exclude: ["date_created", "date_updated"] }, 
        transaction: t });

    return updatedChecklist; //returns an updated checklist to be refreshed on the page
}

const validateNewGroceryItem = (req, res, next) => {
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
                //not adding validation that the category ID as this will not be on the client side as an input, but a dropdown
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

const validateID = async (itemID, modelName, t) => {
    const item = await modelName.findByPk(itemID, 
        { transaction: t }) //do I need plain: true everywhere? 
    //check that the itemID exists
    if (item === null) {
        throw nonExistentItemError;
    }
    return item;
}

module.exports = { 
    getAllItems,
    nonExistentItemError,
    validateNewGroceryItem,
    validateNewCategory,
    addNewItem,
    getItem,
    updateItem,
    deleteItem,
    moveCheckedItem,
 };
