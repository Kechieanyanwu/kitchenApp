



// CURRENTLY WIP
const addToDatabase = async (pool, tableName, newItem) => {
    const client = await pool.connect();
    var addedItem;
    //for field in new item, append to a string, with "," between each
    const query = `INSERT INTO ${tableName} (${newItem.columns}) VALUES (${newItem.values}) RETURNING *`;
    try {
        addedItem = await client.query(query);
    } catch (error) {
        client.release()
        throw error; //how to handle specific types of errors? Probably in future iteration
    };
    client.release();
    return addedItem; //previously returned this but might have to return .rows

    // return { id: 3, category_name: "Vegetables" }
}


//updated for the date created and updated values
const categoriesSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            id: {type: "number"},
            category_name: {type: "string"},
            date_created: { type: "string" },
            date_updated: { type: "string" },
    },
    required: ["id", "category_name", "date_created", "date_updated"],
  },
};

//old version. Testing
// const categoriesSchema = {
//     type: "array",
//     items: {
//         type: "object",
//         properties: {
//             id: {type: "number"},
//             category_name: {type: "string"},
//         },
//         required: ["id", "category_name"],
//     },
// };

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
    addToDatabase,
    categoriesSchema,
    checklistSchema,
    inventorySchema,
    tableNames,
};