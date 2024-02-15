// Model and Sequelize Imports
const { sequelize } = require("../../database/models"); // might eventually call this when creating transaction variable
const { Checklist } = require("../../database/models/checklist");
const { Inventory } = require("../../database/models/inventory");
const { User } = require("../../database/models/user");

// Errors
const nonExistentItemError = new Error("Nonexistent item")
const incompleteItemError = new Error("Item must have an item name, user ID, quantity and category ID")
const incompleteCategoryError = new Error("Request must only contain a category name and user ID")

// to be modified to filter by user

// Beginning of functions
const getAllItems = async (modelName, userID, t) => { //modified for a user
    // let items
    // try {
    //     const items = await modelName.findAll({
    //         where: {
    //             user_id: userID
    //         }
    //     },
    //     { raw: true, attributes: { exclude: ["date_created", "date_updated"] }, transaction: t });

    // } catch (error) {
    //     throw error;
    // }
    // return items;
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

// const getItem = async (modelName, itemID, userID, t) => { //modify so you return the requested item outside of the try-catch thing
//     try{
//         const requestedItem = await modelName.findByPk(itemID, 
//             {
//                 where: {
//                     user_id: userID
//                 }
//             }, 
//             { transaction: t })
//         if (requestedItem === null) {
//             throw nonExistentItemError;
//         } else {
//             delete requestedItem.dataValues.date_created;
//             delete requestedItem.dataValues.date_updated;
//             return requestedItem.dataValues;
//         }

//     } catch (err) {
//         throw err;
//     }
// }

//working here
const addNewUser = async (User, userObject, t) => {
    //could create a new option for users
}


const addNewItem = async(modelName, newItem, t) => { //update to include userID
    try {
        const addedItem = await modelName.create(newItem,
            { transaction: t });

        // remove these columns from result
        delete addedItem.dataValues.date_created;
        delete addedItem.dataValues.date_updated;

        if (modelName.name == "User") {
            delete addedItem.dataValues.hashed_password;
            delete addedItem.dataValues.salt;
        }
        
        // return new item
        return addedItem.dataValues

    } catch (err) {
        throw err;
    }
}

const updateItem = async(modelName, itemID, desiredUpdate, t) => { 
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

    return updatedChecklist;
}

const validateNewGroceryItem = (req, res, next) => {
    if (JSON.stringify(req.body) == "{}") {
        const err = new Error("Empty Body");
        err.status = 400;
        next(err);
    } 
    requestObjectKeys = Object.keys(req.body);
    if (req.body.item_name && req.body.quantity && req.body.category_id && req.body.user_id && (requestObjectKeys.length == 4)) {
        req.item_name = req.body.item_name;
        req.quantity = req.body.quantity;
        req.category_id = req.body.category_id;
        req.user_id = req.body.user_id;
        if (typeof req.item_name === "string" && typeof req.quantity === "number" && typeof req.category_id === "number" && typeof req.body.user_id === "number") {
            next();
        } else {
            const err = new Error("Item name must be a string, userID, quantity and category ID must be a number");
            err.status = 400; 

            next(err);
        }
    } else {
        // const err = new Error("Item must have an item name, user ID, quantity and category ID");
        const err = incompleteItemError;
        err.status = 400; 

        next(err);
    }
};

const validateNewCategory = (req, res, next) => {
    if (JSON.stringify(req.body) == "{}") {
        const err = new Error("Empty Body");
        err.status = 400;
        next(err);
    }
    
    requestObjectKeys = Object.keys(req.body);


    if (req.body.category_name && req.body.user_id && (requestObjectKeys.length == 2)) {
        if (typeof req.body.category_name === "string" && typeof req.body.user_id === "number") {
            req.category_name = req.body.category_name;
            req.user_id = req.body.user_id;
            next();
        } else {
            const err = new Error("Category name must be a string and userID must be a number"); 
            err.status = 400;
            next(err);
        }
    } else {
        const err = incompleteCategoryError;
        err.status = 400;
        next(err);
    }
};



const validateID = async (itemID, modelName, t) => {
    const item = await modelName.findByPk(itemID, 
        { transaction: t }) 

    if (item === null) {
        throw nonExistentItemError;
    }
    return item;
}

module.exports = { 
    getAllItems,
    nonExistentItemError,
    incompleteItemError,
    incompleteCategoryError,
    validateNewGroceryItem,
    validateNewCategory,
    addNewItem,
    getItem,
    updateItem,
    deleteItem,
    moveCheckedItem,
 };
