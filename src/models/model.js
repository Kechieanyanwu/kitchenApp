






//updated for the date created and updated values
const categoriesSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            id: {type: "number"},
            category_name: {type: "string"},
            // date_created: { type: "string" },
            // date_updated: { type: "string" },
    },
    // required: ["id", "category_name", "date_created", "date_updated"],
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
            purchased: {type: "boolean"},
            // date_created: { type: "string" },
            // date_updated: { type: "string" },
        },
        // required: ["id", "item_name", "quantity", "category_id", "purchased", "date_created", "date_updated"],
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
            // date_created: { type: "string" },
            // date_updated: { type: "string" },
        },
        // required: ["id", "item_name", "quantity", "category_id", "date_created", "date_updated"],
        required: ["id", "item_name", "quantity", "category_id"],
    },
};

const tableNames = {
    // havent changed the values, only key. Will decide later if valus is also necessary
    Category: "categories",
    Checklist: "checklist",
    Inventory: "inventory"
}

module.exports = {
    categoriesSchema,
    checklistSchema,
    inventorySchema,
    tableNames,
};