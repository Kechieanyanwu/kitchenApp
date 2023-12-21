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
const { Inventory } = require('../../database/models/inventory');

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
                        requestType: "Good",
                        description: "responds with 200 and the correct item to a valid request",
                        itemID: 3,
                        expectedResponse: { id: 3, category_name: "Cleaning" },
                        expectedStatus: 200,
                    },
                    {
                        requestType: "Bad",
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
                        requestType: "Good",
                        description: "responds with 200 and the correct item to a valid request",
                        itemID: 3,
                        expectedResponse: { id: 3, item_name: "Dettol Wipes", quantity: 3, category_id: 3 },
                        expectedStatus: 200,
                    },
                    {
                        requestType: "Bad",
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
                        requestType: "Good",
                        description: "responds with 200 and the correct item to a valid request",
                        itemID: 3,
                        expectedResponse: { id: 3, item_name: "Dishwashing tabs", quantity: 10, purchased: false, category_id: 3 },
                        expectedStatus: 200,
                    },
                    {
                        requestType: "Bad",
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
                        const { description, itemID, expectedStatus, expectedResponse, expectedError, requestType } = testCase
                        it(description, async() => { //could probably refactor this so we have two separate table-driven tests for A and B. Possibly later 
                            const response = await request(server).get(endpoint.route + itemID);
                            
                            //asserts status code is correct
                            assert.equal(response.status, expectedStatus);
                            
                            //assertion for a good request
                            if(requestType == "Good") {
                                assert.deepEqual(response.body, expectedResponse);
                            }
                            //assertion for a bad request from a nonexistent item
                            if (requestType == "Bad") {
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
            const endpoints = [
                {
                name: "Categories",
                route: "/categories",
                testCases: [
                    {
                        requestType: "Good",
                        description: "responds with 201 to a valid request body",
                        requestBody: { "category_name": "Post Endpoint Test" },
                        expectedStatus: 201,
                        expectedResponse: {"id": 4, "category_name": "Post Endpoint Test"}
                    },
                    {
                        requestType: "Bad",
                        description: "rejects an empty request body",
                        requestBody: undefined,
                        expectedStatus: 400,
                        expectedError: "Empty Body"
                    }, 
                    {
                        requestType: "Bad",
                        description: "rejects a request body with an incorrect schema",
                        requestBody: { "inventory": "Dairy" },
                        expectedStatus: 400,
                        expectedError: "Request must only contain a category name"
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
                            "item_name": "Post Endpoint Test",
                            "quantity": 2,
                            "category_id": 3,
                        },
                        expectedStatus: 201,
                        expectedResponse: {
                            "id": 4,
                            "item_name": "Post Endpoint Test",
                            "quantity": 2,
                            "category_id": 3,
                            "purchased": false
                        },
                    },
                    {
                        requestType: "Bad", //uh-oh, is this code smell? Let's finish and get back to it
                        description: "rejects an empty request body",  
                        requestBody: undefined,
                        expectedStatus: 400,
                        expectedError: "Empty Body"
                    }, 
                    {
                        requestType: "Bad",
                        description: "rejects a request body with an incorrect schema",
                        requestBody: { "inventory": "Dairy" },
                        expectedStatus: 400,
                        expectedError: "Item must have an item name, quantity and category ID"
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
                            "item_name": "Post Endpoint Test",
                            "quantity": 20,
                            "category_id": 3,
                        },
                        expectedStatus: 201,
                        expectedResponse: {
                            "id": 4,
                            "item_name": "Post Endpoint Test",
                            "quantity": 20,
                            "category_id": 3,
                        },
                    },
                    {
                        requestType: "Bad",
                        description: "rejects an empty request body",  
                        requestBody: undefined,
                        expectedStatus: 400,
                        expectedError: "Empty Body"
                    }, 
                    {
                        requestType: "Bad",
                        description: "rejects a request body with an incorrect schema",
                        requestBody: { "inventory": "Dairy" },
                        expectedStatus: 400,
                        expectedError: "Item must have an item name, quantity and category ID"
                    },
                    ]
                },
            ];
            
            endpoints.forEach((endpoint) => {
                describe(`${endpoint.name}`, () => {
                    endpoint.testCases.forEach((testCase) => {
                        const { description, requestBody, expectedStatus, expectedResponse, requestType, expectedError } = testCase
                        it(description, async() => {
                            const response = await request(server).post(endpoint.route).send(requestBody);
                            
                            assert.equal(response.status, expectedStatus);

                            if(requestType == "Good") {
                                assert.deepEqual(response.body, expectedResponse);
                            }

                            if (requestType == "Bad") {
                                assert.deepEqual(response.error.text, expectedError);
                            }
        
                        })
                    })
                })
            })
            });

        describe("Update Item endpoint testing", () => {
            // ---- I AM WORKING HERE ----

            /*
            Creating separate tests first as checklist has the additional check of whether it has been purchased, and whether
            an item updated to be purchased has been deleted from the checklist, and appears in the inventory
            Seems that the first two tests are common among all. Will finalise Checklist item when purchased and see how to refactor
            */
            describe("Category", ()=> {
                it("correctly returns an updated category", async () => {
                    //update item 1
                    const requestBody = { category_name: "Update Category Test" };
                    const itemID = 1;

                    const expectedResponse = { id: 1, category_name: "Update Category Test" };
                    const expectedStatus = 200;

                    //make update
                    const response = await request(server).put("/categories/" + itemID).send(requestBody)

                    //assert that the expectedResponse went through
                    assert.equal(response.status, expectedStatus)
                    assert.deepEqual(response.body, expectedResponse);
                })
                it("returns an error for a nonexistent category", async () => {
                    //update item 11
                    const requestBody = { category_name: "Update Category Endpoint" };
                    const itemID = 11;

                    const expectedError = nonExistentItemError
                    const expectedStatus = 400;

                    //make update
                    const response = await request(server).put("/categories/" + itemID).send(requestBody)

                    //assert that the request failed with the right error and status code
                    assert.equal(response.status, expectedStatus)
                    assert.deepEqual(response.error.text, expectedError.message);
                })

            })
            describe("Inventory", () => {
                it("correctly returns an updated inventory item", async () => {
                    //update item 1
                    const requestBody = {
                        "item_name": "Update Inventory Item Test",
                        "quantity": 25,
                        "category_id": 2,
                    };
                    const itemID = 1;

                    const expectedResponse = {
                        "id": 1,
                        "item_name": "Update Inventory Item Test",
                        "quantity": 25,
                        "category_id": 2,
                    };
                    const expectedStatus = 200;

                    //make update
                    const response = await request(server).put("/inventory/" + itemID).send(requestBody)

                    //assert that the expectedResponse went through
                    assert.equal(response.status, expectedStatus)
                    assert.deepEqual(response.body, expectedResponse);
                })
                it("returns an error for a nonexistent item", async () => {
                    //update item 11
                    const requestBody = {
                        "item_name": "Update Inventory Item Test",
                        "quantity": 25,
                        "category_id": 2,
                    };
                    const itemID = 11;

                    const expectedError = nonExistentItemError
                    const expectedStatus = 400;

                    //make update
                    const response = await request(server).put("/inventory/" + itemID).send(requestBody)

                    //assert that the request failed with the right error and status code
                    assert.equal(response.status, expectedStatus)
                    assert.deepEqual(response.error.text, expectedError.message);
                })
            })
            describe("Checklist", () => {
                it("Correctly returns an updated unpurchased checklist item", async () => {
                    //update item 1
                    const requestBody = {
                        "item_name": "Update Checklist Item Test",
                        "quantity": 13,
                        "category_id": 3,
                    };
                    const itemID = 1;

                    const expectedResponse = {
                        "id": 1,
                        "item_name": "Update Checklist Item Test",
                        "quantity": 13,
                        "category_id": 3,
                        "purchased": false
                    };
                    const expectedStatus = 200;

                    //make update
                    const response = await request(server).put("/checklist/" + itemID).send(requestBody)

                    //assert that the expectedResponse went through
                    assert.equal(response.status, expectedStatus)
                    assert.deepEqual(response.body, expectedResponse);
                })
                it("returns an error for a nonexistent item", async () => {
                    //update item 11
                    const requestBody = {
                        "item_name": "Update Checklist Item Test",
                        "quantity": 13,
                        "category_id": 3,
                    };
                    const itemID = 11;

                    const expectedError = nonExistentItemError
                    const expectedStatus = 400;

                    //make update
                    const response = await request(server).put("/checklist/" + itemID).send(requestBody)

                    //assert that the request failed with the right error and status code
                    assert.equal(response.status, expectedStatus)
                    assert.deepEqual(response.error.text, expectedError.message);
                })
                it("correctly moves a purchased item to the inventory", async () => { //might end up with another implementation of this based on the front end
                    //update item and set purchased to true
                    const requestBody = {
                        "item_name": "Update Checklist Item Test",
                        "quantity": 13,
                        "category_id": 3,
                        "purchased": true
                    };
                    const itemID = 1;
                    const assertDeletedItem = {
                        "id": 1,
                        "item_name": "Update Checklist Item Test",
                        "quantity": 13,
                        "category_id": 3,
                        "purchased": true
                    };

                    assertIncludedItem = {
                        "id": 5,
                        "item_name": "Update Checklist Item Test",
                        "quantity": 13,
                        "category_id": 3,
                    };

                    const expectedResponse = "Item is now in inventory";
                    const expectedStatus = 200;

                    //make update
                    const response = await request(server).put("/checklist/" + itemID).send(requestBody)

                    //assert that the item was added successfully and the response wasn't an updated item
                    assert.equal(response.status, expectedStatus)
                    assert.equal(response.text, expectedResponse);  //currently asserting on the text
                    
                    //asserting that the item has been moved
                    const checklistArray = await getAllItems(Checklist)
                    
                    //assert that the item is no longer in the checklist
                    assert.notDeepNestedInclude(checklistArray, assertDeletedItem);
                    //assert that the item is now in the inventory
                    assert.deepNestedInclude(inventoryArray, assertIncludedItem);
                 })
            })
        })
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
                    const mockAddedItem = { id: 5, category_name: "addNewItem test category"}; //id 4 because we have 3 items in test database. Is this too coupled?

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
})




/* Questions
3. How can I close a server quicker after tests are complete
4. Do I need to test getItem / addItem for all models? 
*/

