// Test framework Imports
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const request = require("supertest");
const {app, server} = require("../server"); 
const { after } = require('node:test');

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

// Usage binding
chai.use(require('chai-json-schema-ajv')); //for validating JSON schema
chai.use(require('chai-as-promised')); //extends chai to handle promises 


// Beginning of tests
describe("KitchenApp testing", function () {
    after(() => {
        server.close()
    }); //this takes TOO LONG to close. Why? 

    describe("Server testing", () => {
        describe("loading express", () => {
            it("responds to /", async function testslash() {
                const response = await request(server)
                .get("/");
                assert.equal(response.status, 200);
                assert.equal(response.body, "Hello World");
            });

        });
    });


    describe("Endpoint testing", () => {
        describe("GET Endpoint testing", () => { 
            const endpoints = [
                {
                    name: "Categories",
                    path: "/categories",
                    schema: categoriesSchema,
                },
                {
                    name: "Checklist",
                    path: "/checklist",
                    schema: checklistSchema,
                },
                {
                    name: "Inventory",
                    path: "/inventory",
                    schema: inventorySchema,
                },
            ];
        
            for (const endpoint of endpoints) {
                describe(`${endpoint.name}`, () => {
                    it("sends a 200 code on a good request" , async () => {
                        const response = await request(server).get(endpoint.path);
                        assert.equal(response.status, 200);
                    });
                    it("sends JSON response with correct schema", async () => {
                        const response = await request(server).get(endpoint.path);
                        assert.jsonSchema(response.body, endpoint.schema);
                    });
                });
            }
        })

        describe("GET item endpoint testing", () => {
            const endpoints = [
                {
                name: "Categories",
                route: "/categories/",
                testCases: [
                    {
                        description: "responds with 200 and the correct item to a valid request",
                        itemID: 3,
                        expectedResponse: { id: 3, category_name: "Cleaning" },
                        expectedStatus: 200,
                    },
                    {
                        description: "returns a 400 error for a nonexistent item",
                        itemID: 10,
                        expectedStatus: 400,
                        expectedError: nonExistentItemError,
                        //do i also assert the message? Could add later
                    }
                    ]
                },
                {
                name: "Inventory",
                route: "/inventory/",
                testCases: [
                    {
                        description: "responds with 200 and the correct item to a valid request",
                        itemID: 3,
                        expectedResponse: { id: 3, item_name: "Dettol Wipes", quantity: 3, category_id: 3 },
                        expectedStatus: 200,
                    },
                    {
                        description: "returns a 400 error for a nonexistent item",
                        itemID: 10,
                        expectedStatus: 400,
                        expectedError: nonExistentItemError,
                        //do i also assert the message? Could add later
                    }
                    ]
                },
                {
                name: "Checklist",
                route: "/checklist/",
                testCases: [
                    {
                        description: "responds with 200 and the correct item to a valid request",
                        itemID: 3,
                        expectedResponse: { id: 3, item_name: "Dishwashing tabs", quantity: 10, purchased: false, category_id: 3 },
                        expectedStatus: 200,
                    },
                    {
                        description: "returns a 400 error for a nonexistent item",
                        itemID: 10,
                        expectedStatus: 400,
                        expectedError: nonExistentItemError,
                        //do i also assert the message? Could add later
                    }
                    ]
                }
            ]
            endpoints.forEach((endpoint) => {
                describe(`${endpoint.name}`, () => {
                    endpoint.testCases.forEach((testCase) => {
                        const { description, itemID, expectedStatus, expectedResponse, expectedError } = testCase
                        it(description, async() => { //could probably refactor this so we have two separate table-driven tests for A and B. Possibly later 
                            const response = await request(server).get(endpoint.route + itemID);
                            
                            //asserts status code is correct
                            assert.equal(response.status, expectedStatus);
                            
                            //assertion for a good request
                            if (expectedResponse != null) { //i.e. there is no response body for a 400 error
                                assert.deepEqual(response.body, expectedResponse);
                            } 
                            //assertion for a bad request from a nonexistent item
                            if (expectedError != null) {
                                assert.deepEqual(response.error.text, expectedError.message);
                            } 
                        })
                    })
                })
            })
        })
        
        //to come back to this after get specific item. Do i need to send a get request when updating? So the form is populated?     
        //to update endpoint tests now that I have created the controller functions 
        describe("POST endpoint testing", () => {
            // ---- I AM WORKING HERE NKECHI ---
            const endpoints = [
                {
                name: "Categories",
                route: "/categories",
                testCases: [
                    {//what I dont want is for my test to actually populate my database. I just want it to check that the response is correct, so 
                        description: "responds with 201 to a valid request body",
                        requestBody: { "category_name": "Dairy" },
                        expectedStatus: 201,
                        // expectedResponse: {"id": 1, "category_name": "Dairy"}
                        //somehow will modify expected response to have ID and category name keys, and the category name must be dairy 
                        // is including validation for expectedstatus too coupled? 
                    },
                    {
                        description: "rejects an empty request body",
                        requestBody: undefined,
                        expectedStatus: 400,
                        //do I need to include a response here? For consistency, maybe. To ask Chidi 
                    }, 
                    {
                        description: "rejects a request body with an incorrect schema",
                        requestBody: { "inventory": "Dairy" },
                        expectedStatus: 400,
                    }
                    ]
                },
                {
                    name: "Checklist",
                    route: "/checklist",
                    testCases: [
                    {
                        description: "responds with 201 to a valid request body",  
                        requestBody: {
                            "item_name": "Milk",
                            "quantity": 2,
                            "category_id": 3,
                        },
                        expectedStatus: 201,
                    },
                    {
                        description: "rejects an empty request body",  
                        requestBody: undefined,
                        expectedStatus: 400,
                    }, 
                    {
                        description: "rejects a request body with an incorrect schema",
                        requestBody: { "inventory": "Dairy" },
                        expectedStatus: 400,
                    },
                    ]
                },
                {
                    name: "Inventory",
                    route: "/inventory",
                    testCases: [
                    {
                        description: "responds with 201 to a valid request body",  
                        requestBody: {
                            "item_name": "Bread",
                            "quantity": 2,
                            "category_id": 3,
                        },
                        expectedStatus: 201,
                    },
                    {
                        description: "rejects an empty request body",  
                        requestBody: undefined,
                        expectedStatus: 400,
                    }, 
                    {
                        description: "rejects a request body with an incorrect schema",
                        requestBody: { "inventory": "Dairy" },
                        expectedStatus: 400,
                    },
                    ]
                },
            ];
            
            endpoints.forEach((endpoint) => {
                describe(`${endpoint.name}`, () => {
                    endpoint.testCases.forEach((testCase) => {
                        const { description, requestBody, expectedStatus, expectedResponse } = testCase
                        it(description, async() => {
                            const response = await request(server).post(endpoint.route).send(requestBody);
                            assert.equal(response.status, expectedStatus);
        
                        })
                    })
                })
            })
            });
    })


    describe('Controller Function tests', () => {
        describe("General Controller functions", async () => {

            // general transaction for all tests in this section
            t = await sequelize.transaction();

            describe("GetAllItems", async () => {
                it("returns all items from the database", async () => {
                    const categoriesArray = await getAllItems(Category, t);

                    //do I even want to return the date created and updated? Can this just stay in the db? 
                    for (const category of categoriesArray) { //changing to string because JSON schema is validating string
                        category.date_created = '' + category.date_created;
                        category.date_updated = '' + category.date_updated;
                    }
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
                    const mockAddedItem = { id: 4, category_name: "Dairy"}; //id 4 because we have 3 items in test database. Is this too coupled?

                    //create dummy data
                    const mockRequestBody = { "category_name": "Dairy" }
                    
                    //send to database using function
                    const newItem = await addNewItem(Category, mockRequestBody, t);
                    
                    const assertItem = {} //doing this to ignore the timestamp, but it seems a bit too coupled to the category object shape. Leaving for now
                    assertItem.id = newItem.id;
                    assertItem.category_name = newItem.category_name;
                    
                    //validate that the request was fulfilled
                    assert.deepEqual(assertItem, mockAddedItem); 
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

                    const assertItem = {} //doing this to ignore the timestamp, but it seems a bit too coupled to the category object shape. Leaving for now
                    assertItem.id = actualUpdate.id;
                    assertItem.category_name = actualUpdate.category_name;
            
                    //assert that the item is now updated to the mock item
                    assert.deepEqual(assertItem, desiredUpdate); 
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
                    
                    const deletedItem = await deleteItem(modelName, itemID, t);

                    assert.notDeepNestedInclude(deletedItem, assertDeletedItem);
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
})




/* Questions
3. How can I close a server quicker after tests are complete
4. Do I need to test getItem / addItem for all models? 
*/

