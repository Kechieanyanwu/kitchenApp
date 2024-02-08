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
        const err = new Error("Request must only contain a category name and user ID");
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

// const validateNewGroceryItem = (req, res, next) => {
//     if (JSON.stringify(req.body) == "{}") {
//         const err = new Error("Empty Body");
//         err.status = 400;
//         next(err);
//     } else {
//         numKeysInReq = Object.keys(req.body);
//         if (req.body.item_name && req.body.quantity && req.body.category_id && (numKeysInReq.length == 3)) {
//             req.item_name = req.body.item_name;
//             req.quantity = req.body.quantity;
//             req.category_id = req.body.category_id;
//             if (typeof req.item_name === "string" && typeof req.quantity === "number" && typeof req.category_id === "number") {
//                 //not adding validation that the category ID as this will not be on the client side as an input, but a dropdown
//                 next();
//             } else {
//                 const err = new Error("Item name must be a string, quantity and category ID must be a number");
//                 err.status = 400; 
    
//                 next(err);
//             }
//         } else {
//             const err = new Error("Item must have an item name, quantity and category ID");
//             err.status = 400; 

//             next(err);
//         }
//     }
// };