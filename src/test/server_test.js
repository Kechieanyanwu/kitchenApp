// Test framework Imports
const chai = require('chai');
const assert = chai.assert;
const request = require("supertest");
const { server } = require("../server"); 


// Model Imports 
const { categoriesSchema,
        checklistSchema,
        inventorySchema } = require('../models/model');

// Controller Imports
const { getAllItems,
    nonExistentItemError,
} = require('../controllers/controller');

// Sequelize Imports
const { Inventory } = require('../../database/models/inventory');

// Usage binding
chai.use(require('chai-json-schema-ajv')); //for validating JSON schema
chai.use(require('chai-as-promised')); //extends chai to handle promises 


// Beginning of tests
describe("KitchenApp testing", function () {
    after(() => {
        server.close()
    }); //this takes TOO LONG to close. Why? 

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
        
        describe("POST endpoint testing", () => {
            const endpoints = [
                {
                name: "Categories",
                route: "/categories",
                testCases: [
                    {
                        requestType: "Good",
                        description: "responds with 201 to a valid request body",
                        requestBody: { "category_name": "Post Category Test" },
                        expectedStatus: 201,
                        expectedResponse: {"id": 6, "category_name": "Post Category Test"}
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
                            "item_name": "Post Checklist Test",
                            "quantity": 2,
                            "category_id": 3,
                        },
                        expectedStatus: 201,
                        expectedResponse: {
                            "id": 6,
                            "item_name": "Post Checklist Test",
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
                            "item_name": "Post Inventory Test",
                            "quantity": 20,
                            "category_id": 3,
                        },
                        expectedStatus: 201,
                        expectedResponse: {
                            "id": 6,
                            "item_name": "Post Inventory Test",
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
            /*
            Creating separate tests first as checklist has the additional check of whether it has been purchased, and whether
            an item updated to be purchased has been deleted from the checklist, and appears in the inventory
            Seems that the first two tests are common among all. Will finalise Checklist item when purchased and see how to refactor
            Should there be an assertion for whether the change to the category name is shown on the items? 
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
                        "category_id": 1,
                    };
                    const itemID = 1;

                    const expectedResponse = {
                        "id": 1,
                        "item_name": "Update Checklist Item Test",
                        "quantity": 13,
                        "category_id": 1,
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
                        "category_id": 1,
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
                        "category_id": 1,
                        "purchased": true
                    };
                    const itemID = 1;
                    const assertDeletedItem = {
                        "id": 1,
                        "item_name": "Update Checklist Item Test",
                        "quantity": 13,
                        "category_id": 1,
                        "purchased": false
                    };

                    const assertIncludedItem = {
                        "id": 7,
                        "item_name": "Update Checklist Item Test",
                        "quantity": 13,
                        "category_id": 1,
                    };

                    const expectedStatus = 200;

                    //make update
                    const response = await request(server).put("/checklist/" + itemID).send(requestBody)

                    //assert that the item was added successfully and the response wasn't an updated item
                    assert.equal(response.status, expectedStatus)
                    
                    //asserting that the item is now in Inventory
                    const inventoryArray = await getAllItems(Inventory)

                    
                    //assert that the item is no longer in the checklist
                    assert.notDeepNestedInclude(response.body, assertDeletedItem);
                    //assert that the item is now in the inventory
                    assert.deepNestedInclude(inventoryArray, assertIncludedItem);
                 })
            })
        })
        describe("Delete Item Endpoint Testing", ()=> {
            describe("Categories", () => {
                it("successfully deletes an existing item", async () => {
                    const itemID = 4;
                    const assertDeletedItem = {
                        "id": 4, //wip
                        "category_name": "Post Category Test"
                    };
                    const expectedStatus = 200;
    
                    const response = await request(server).delete("/categories/" + itemID);
    
                    assert.equal(response.status, expectedStatus);
    
                    //assert that the item has been deleted from the returned array
                    assert.notDeepNestedInclude(response, assertDeletedItem); //double check this
                })
            })
            //not manually asserting that a deleted category deletes all checklist and inventory entries as that lies with SQL. 

            describe("Checklist", () => {
                it("successfully deletes an existing item", async () => {
                    // --- WORKING HERE ----
                    const itemID = 4;
                    const assertDeletedItem = {
                        "id": 4,
                        "item_name": "Post Checklist Test",
                        "quantity": 2,
                        "category_id": 3,
                        "purchased": false
                    };
                    
                    const expectedStatus = 200;
    
                    const response = await request(server).delete("/checklist/" + itemID);
    
                    assert.equal(response.status, expectedStatus);
    
                    //assert that the item has been deleted from the returned array
                    assert.notDeepNestedInclude(response, assertDeletedItem);
                })
            })

            describe("Inventory", () => {
                it("successfully deletes an existing item", async () => {
                    // --- WORKING HERE ----
                    const itemID = 1;
                    const assertDeletedItem = {
                        "id": 1,
                        "item_name": "Update Inventory Item Test",
                        "quantity": 25,
                        "category_id": 2
                    };
                    
                    const expectedStatus = 200;
    
                    const response = await request(server).delete("/inventory/" + itemID);
    
                    assert.equal(response.status, expectedStatus);
    
                    //assert that the item has been deleted from the returned array
                    assert.notDeepNestedInclude(response, assertDeletedItem);
                })
            })


        })

    })
})


