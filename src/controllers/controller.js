const { tableNames } = require("../models/model");
const { sequelize } = require("../../database/models");

const noTableError = new Error("no table specified");
const nonExistentTableError = new Error("table does not exist");
const nonExistentItemError = new Error("Nonexistent item")


//REMEMBER TO PASS TRANSACTION T INTO EVERY SEQUELIZE CALL


const getAllItems = async (modelName, t) => {
    validateModelName(modelName.name); //is there a better place to do this?
    //to update to not return data and time 
        try {
                const items = await modelName.findAll(
                { raw: true }, 
                { transaction: t }); 
                return items;
        } catch (error) {
            throw error;
    }
}

const getItem = async (modelName, itemID, t) => {
    validateModelName(modelName.name); //is there a better place to do this? 

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


const addNewItem = async(modelName, requestBody, t) => {
    validateModelName(modelName.name); 

    const newItem = requestBody; //using this for now to test
    
    try {
            const addedItem = await modelName.create(newItem, 
                { attributes: { exclude: ["date_created", "date_updated"] }, transaction: t, });
                // console.log("addedItem", addedItem); //test
                const items = await modelName.findAll( //test
                    { raw: true , 
                    attributes: {exclude: ["date_created", "date_updated"]},//test
                    transaction: t }); //test
                    console.log(items); //test
                return addedItem.dataValues
                //testing why i cant exclude date created and date updated
    } catch (err) {
        throw err;
    }


}

const updateItem = async(modelName, itemID, desiredUpdate, t) => { //testing passing a transaction from outside
    validateModelName(modelName.name); 

    const items = await modelName.findAll( //test
    { raw: true , 
    attributes: {exclude: ["date_created", "date_updated"]},//test
    transaction: t }); //test
    console.log(items); //test

    try {
            const item = await modelName.findByPk(itemID, 
                { attributes: {exclude: ["date_created", "date_updated"]},
                transaction: t,
                plain: true }) //do I need plain: true everywhere? 
            //check that the itemID exists
            if (item === null) {
                    throw nonExistentItemError;
            }

            //update with new details
            await item.update(desiredUpdate, { transaction: t });
            //how to i remove date_updated?
            //return updated item 
            const items = await modelName.findAll( //test
            { raw: true , 
            attributes: {exclude: ["date_created", "date_updated"]},//test
            transaction: t }); //test
            console.log(items); //test

            return item.dataValues;
    } catch (err) {
        throw err;
    }
}

const deleteItem = async (modelName, itemID, t) => {
    validateModelName(modelName.name); 
    console.log("itemID", itemID); //test
    var items;
    try {
        const item = await modelName.findByPk(itemID, 
            { attributes: {exclude: ["date_created", "date_updated"]},
            transaction: t,
            plain: true }) //do I need plain: true everywhere? 
        //check that the itemID exists
        if (item === null) {
                throw nonExistentItemError;
        } else {
            console.log("item gotten is", requestedItem); //test
            await item.destroy({ transaction: t });
            const items = await modelName.findAll(
                { raw: true , 
                attributes: {exclude: ["date_created", "date_updated"]},
                transaction: t }); 
                return items; 
        }

            // const result = await modelName.destroy({
            //     where: {
            //         id: itemID
            //     }, returning: true,
            //     transaction: t
            // });
            // console.log("result",result)
            // if (result === 0) {
            //     throw nonExistentItemError;
            // } else {
            //     const items = await modelName.findAll(
            //         { raw: true , 
            //         attributes: {exclude: ["date_created", "date_updated"]},
            //         transaction: t }); 
            //         return items; 
            // }
            // //get the updated items in database

        // }
    } catch (err) {
        throw err;
    }

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
    nonExistentItemError,
    validateNewGroceryItem,
    validateNewCategory,
    validateModelName,
    addNewItem,
    getItem,
    updateItem,
    deleteItem,
 };
