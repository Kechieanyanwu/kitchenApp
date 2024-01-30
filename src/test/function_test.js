// Test framework Imports
const chai = require('chai');
const assert = chai.assert;
const {app, server} = require("../server"); 


// Model Imports 
const { categoriesSchema } = require('../models/model');

// Controller Imports
const { getAllItems,
        addNewItem,
        getItem,
        nonExistentItemError,
        updateItem,
        deleteItem} = require('../controllers/controller');

// Sequelize Imports
const { Category } = require('../../database/models/category');
const { sequelize, Sequelize } = require('../../database/models');

// Usage binding
chai.use(require('chai-json-schema-ajv')); //for validating JSON schema
chai.use(require('chai-as-promised')); //extends chai to handle promises 


// Beginning of tests
describe("Controller Function tests", function () { 
    describe("General Controller functions", async () => { 

        t = await sequelize.transaction(); 
        
        after( async () => { 
            await t.commit();
        })

        describe("GetAllItems", async () => {
            it("returns all items from the database", async () => {
                const categoriesArray = await getAllItems(Category, t);
                assert.jsonSchema(categoriesArray, categoriesSchema);
            })
        });

        describe("Get Item", async () => {
            it("returns the requested item specified by ID", async () => {
                const requestedID = 2;
                const modelName = Category;
                requestedItem =           
                {
                    id: 2,
                    category_name: "Condiments"
                }

                const categoryItem = await getItem(modelName, requestedID, t); 

                assert.deepEqual(requestedItem, categoryItem);
            })

            it("throws an error if a nonexistent ID is specified", async () => {
                const requestedID = 10;
                const modelName = Category;

                await assert.isRejected(getItem(modelName, requestedID, t), nonExistentItemError); 
            })
        })

        describe("addNewItem", async () => { 
            it("returns the newly added item", async () => {
                const mockAddedItem = { id: 7, category_name: "addNewItem test category"};

                //create dummy data
                const mockRequestBody = { "category_name": "addNewItem test category" }

                //send to database using function
                const newItem = await addNewItem(Category, mockRequestBody, t);

                //validate that the request was fulfilled
                assert.deepEqual(newItem, mockAddedItem); 

            });
        });
        
        describe("UpdateItem", async () => {

            it("returns the updated item", async() => {
                //setup
                const itemID = 1;
                const update = { category_name: "Update Category" }
                const modelName = Category;

                const desiredUpdate = { id: 1, category_name: "Update Category" }
                
                //update existing item
                const actualUpdate = await updateItem(modelName, itemID, update, t);
        
                //assert that the item is now updated to the mock item
                assert.deepEqual(actualUpdate, desiredUpdate); 
            })

            it("throws an error if a nonexistent ID is specified", async () => {
                const requestedID = 10;
                const modelName = Category;
                const update = { category_name: "Update Category" }

                await assert.isRejected(updateItem(modelName, requestedID, update, t), nonExistentItemError); 
            })

        })

        describe("Delete Item", () => { 
            it("Successfully deletes a specified item by ID", async () => {
                const itemID = 5; 
                const modelName = Category;
                const assertDeletedItem = { id: 5, category_name: "Delete Item Test"}; 
                
                const items = await deleteItem(modelName, itemID, t);

                assert.notDeepNestedInclude(items, assertDeletedItem);
            })
            it("throws an error if a nonexistent ID is specified", async () => {
                const itemID = 10;
                const modelName = Category;

                await assert.isRejected(deleteItem(modelName, itemID, t), nonExistentItemError); 
            })
        })


    })

})
