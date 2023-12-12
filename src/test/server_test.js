const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;
const should = chai.should(); //note, you have to actually call the function
const expect = chai.expect;
const request = require("supertest");
const {app, server} = require("../server"); 
const { after } = require('node:test');


const model = require('../models/model'); //general import as you can't destructure when stubbing with sinon

const categoriesSchema = model.categoriesSchema;
const checklistSchema = model.checklistSchema;
const inventorySchema = model.inventorySchema;

const { getAllItems,
        noTableError,
        nonExistentTableError, 
        buildNewItem,
        addNewItem,
        validateModelName,
        getItem} = require('../controllers/controller');

// importing models from Sequelize
const { Checklist } = require('../../database/models/checklist');
const { Category } = require('../../database/models/category');

chai.use(require('chai-json-schema-ajv')); //for validating JSON schema
chai.use(require('chai-as-promised')); //extends chai to handle promises 


describe("KitchenApp testing", function () {
    after(server.close()); //this takes TOO LONG to close. Why? 

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
        //this is more of an integration test than a unit test. How to modify so it doesnt directly modify my db? 
        
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
    
    //to come back to this after get specific item. Do i need to send a get request when updating? So the form is populated?
    
    //might need to include test for what the response is
    describe("POST endpoint testing", () => {
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

      

describe('Database Function tests', () => {
    describe("General Database functions", () => {
        describe("Sequelize Function tests", () => {
            //to come if applicable
        });
        })
    })

describe('Controller Function tests', () => {
    describe("General Controller functions", () => {
        describe("GetAllItems", async () => {
            it("returns all items from the database", async () => {
                const categoriesArray = await getAllItems(Category);

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

                const categoryItem = await getItem(modelName, requestedID); 

                assert.deepEqual(requestedItem, categoryItem);
            })

            //WIP
            it("throws an error if a nonexistent ID is specified", async () => {
                const requestedID = 10;
                const modelName = Category;
                const expectedError = new Error("Nonexistent item");
                assert.throws(async () => {
                    await getItem(modelName, requestedID)}, expectedError.message); 

            })
        })

        describe("buildNewItem", () => { //havent exported yet
            it("transforms a request object into a new item object", () => {
                const requestBody = {
                    "item_name": "Milk",
                    "quantity": 2,
                    "category_id": 3,
                  };
                const expectedNewItem = {
                    columns: "item_name, quantity, category_id",
                    values: "'Milk', 2, 3"
                };
                
                //run function and check we get the right object
                const result = buildNewItem(requestBody);
                assert.deepEqual(result, expectedNewItem);

            })
        });

        describe("addNewItem", async () => {
            it("returns the newly added item", async () => {
                const mockAddedItem = { id: 4, category_name: "Dairy"}; //id 4 because we have 3 items in test database. Is this too coupled?

                //create dummy data
                const mockRequestBody = { "category_name": "Dairy" }
                
                //send to database using function
                const newItem = await addNewItem(Category, mockRequestBody);
                
                const assertItem = {} //doing this to ignore the timestamp
                assertItem.id = newItem.id;
                assertItem.category_name = newItem.category_name;
                
                //validate that the request was fulfilled
                assert.deepEqual(assertItem, mockAddedItem); //test
            });
            it("handles an error from the db correctly", async () => {
                // to set this up later
            });
        });
        
        describe("UpdateItem", () => {
            it("returns the updated item", async() => {
                //update existing item
        
                //assert that the item is now updated to the mock item
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



// server.close()
//include describe block for validate functions
//it rejects invalid category item 
    //could be a getCategory function to validate 




/* Questions
3. How can I close a server quicker after tests are complete
4. Do I need to test getItem for all models? 
*/