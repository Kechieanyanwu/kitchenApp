const getAllFromDatabase = async (pool, tableName) => {
    const client = await pool.connect();  
    var result;
    const query = 'SELECT * FROM ' + tableName;

    try {
        result = await client.query(query);
    } catch (error) {
        //throw it back to the calling function 
        client.release()
        throw error; //how to handle specific types of errors? Probably in future iteration
    };

    const queryResult = result.rows;
    client.release();
    
    return queryResult; 
}

const categoriesSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            id: {type: "number"},
            category_name: {type: "string"},
        },
        required: ["id", "category_name"],
    },
};

const checklistSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            id: {type: "number"},
            item_name: {type: "string"},
            quantity: {type: "number"},
            category_id: {type: "number"},
            purchased: {type: "boolean"}
        },
        required: ["id", "item_name", "quantity", "category_id", "purchased"],
    }
}

const inventorySchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            id: { type: "number" },
            item_name: { type: "string" },
            quantity: { type: "integer" },
            category_id: { type: "integer" },
        },
        required: ["id", "item_name", "quantity", "category_id"],
    },
};

const tableNames = {
    categories: "categories",
    checklist: "checklist",
    inventory: "inventory"
}

module.exports = { 
    getAllFromDatabase,
    categoriesSchema,
    checklistSchema,
    inventorySchema,
    tableNames,
};