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
    validateModelName,
    validateNewCategory,
    validateNewGroceryItem,
    validateID,
}