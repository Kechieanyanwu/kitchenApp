// Test framework Imports
const chai = require('chai');
const assert = chai.assert;

// Model Imports 
const { categoriesSchema,
        checklistSchema,
        inventorySchema } = require('../models/model');

// Controller Imports
const { getAllItems,
        noTableError,
        nonExistentTableError, 
        addNewItem,
        validateModelName,
        getItem,
        nonExistentItemError,
        updateItem,
        deleteItem} = require('../controllers/controller');

// Sequelize Imports
const { Checklist } = require('../../database/models/checklist');
const { Category } = require('../../database/models/category');
const { sequelize, Sequelize } = require('../../database/models');
const { Inventory } = require('../../database/models/inventory');

// Usage binding
chai.use(require('chai-json-schema-ajv')); //for validating JSON schema
chai.use(require('chai-as-promised')); //extends chai to handle promises 


// Beginning of tests
describe("Controller Function tests", function () { //why isnt this showing up on terminal?
    describe("General Controller functions", async () => { //why isnt this showing up on terminal?

        // general transaction for all tests in this section
        t = await sequelize.transaction();

        describe("GetAllItems", async () => {
            it("returns all items from the database", async () => {
                const categoriesArray = await getAllItems(Category, t);
                assert.jsonSchema(categoriesArray, categoriesSchema);
            })
        });

        describe("Get Item", async () => {
            it("returns the requested item specified by ID", async () => { //to update this for other tables? 
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

        describe("addNewItem", async () => { // this test feels too coupled to Category. Future update could be to change this
            it("returns the newly added item", async () => {
                const mockAddedItem = { id: 5, category_name: "addNewItem test category"}; // Is this too coupled? How to assert without specifying the ID number? 

                //create dummy data
                const mockRequestBody = { "category_name": "addNewItem test category" } //should I take out this string quotes?
                
                //send to database using function
                const newItem = await addNewItem(Category, mockRequestBody, t);
                                    
                //validate that the request was fulfilled
                assert.deepEqual(newItem, mockAddedItem); 
            });
            it("handles an error from the db correctly", async () => {
                // to set this up later
            });
        });
        
        describe("UpdateItem", async () => {

            it("returns the updated item", async() => {
                //setup
                const itemID = 3;
                const update = { category_name: "Update Category" }
                const modelName = Category;

                const desiredUpdate = { id: 3, category_name: "Update Category" }
                
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
                const itemID = 4; //this is the newly added item from the addItem test. Does this make it too coupled? 
                const modelName = Category;
                const assertDeletedItem = { id: 4, category_name: "Dairy"}; 
                
                const items = await deleteItem(modelName, itemID, t);

                assert.notDeepNestedInclude(items, assertDeletedItem);
            })
            it("throws an error if a nonexistent ID is specified", async () => {
                const itemID = 10;
                const modelName = Category;

                await assert.isRejected(deleteItem(modelName, itemID, t), nonExistentItemError); 
            })
        })

        describe("validateModelName", () => {
            it("throws an error if no table name is specified", () => {
                const emptyTable = "";
                assert.throws(() => {
                    validateModelName(emptyTable)}, noTableError);
            });
            it("throws an error if a non-existent table is specified", () => {
                const nonExistentTable = "Banana";
                assert.throws(() => {
                    validateModelName(nonExistentTable)}, nonExistentTableError);
            })
        })
    })
})




/* Questions
3. How can I close a server quicker after tests are complete
4. Do I need to test getItem / addItem for all models? 
*/

