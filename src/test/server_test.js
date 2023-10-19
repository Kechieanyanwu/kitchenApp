const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;
const should = chai.should(); //note, you have to actually call the function
const expect = chai.expect;
const request = require("supertest");
const {app, server} = require("../server"); 
const { after } = require('node:test');

const model = require('../models/model'); //general import as you can't destructure when stubbing with sinon
const getAllFromDatabase = model.getAllFromDatabase;
const addToDatabase = model.addToDatabase;
const categoriesSchema = model.categoriesSchema;
const checklistSchema = model.checklistSchema;
const inventorySchema = model.inventorySchema;

const { getAllItems,
        noTableError,
        nonExistentTableError, 
        buildNewItem} = require('../controllers/controller');

chai.use(require('chai-json-schema-ajv')); //for validating JSON schema
chai.use(require('chai-as-promised')); //extends chai to handle promises 


//need to find a way to close server after the tests are complete; could us AfterAll
describe("Server testing", () => {
    after((server) => { //somehow this block is never being activated
        // server.close(() => {
        //     console.log("Server closed"); // never reaching this endpoint
        //     done();
        // });
        // server.close((err) => {
        //     console.log("Http server closed.");
        //     process.exit(err ? 1 : 0);
        // });
        //perhaps will just use http-terminator?
    });

    describe("loading express", () => {
        it("responds to /", async function testslash() {
            const response = await request(server)
            .get("/");
            assert.equal(response.status, 200);
            assert.equal(response.body, "Hello World");
        });

    });
});

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
        describe(`GET ${endpoint.name}`, () => {
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
describe("POST endpoint testing", () => {
    const endpoints = [
        {
          name: "Categories",
          route: "/categories",
          testCases: [
            {
                description: "responds with 201 to a valid request body",
                requestBody: { "category_name": "Dairy" },
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
        describe(`POST ${endpoint.name}`, () => {
            endpoint.testCases.forEach((testCase) => {
                const { description, requestBody, expectedStatus } = testCase
                it(description, async() => {
                    const response = await request(server).post(endpoint.route).send(requestBody);
                    assert.equal(response.status, expectedStatus);
                })
            })
        })
    })
      });
      

describe('Database Function tests', () => {
    describe("General Database functions", () => {
        describe("getAllFromDatabase" ,() => {
            it("returns all items from a successful db query", async () => {
                const mockCategoriesList = [
                    { id: 1, category_name: "Dairy"},
                    { id: 2, category_name: "Grains"}
                ]
                //mock connection pool
                const mockPool = {
                    connect: async () => {
                        return {
                            query: async () => {
                                return {rows: mockCategoriesList}
                            },
                            release: () => {} // mocks the release method of a pool
                        }
                    }
                }
                const response = await getAllFromDatabase(mockPool, "categories") //abstract away all names
                assert.deepEqual(response, mockCategoriesList);
                await assert.isFulfilled(getAllFromDatabase(mockPool, "categories")); //asserting no error occurred
            });
            it("returns an error correctly", async () => { 
                const mockError = new Error('test error'); // Used for our mock DB to throw

                //code smell. Seems like I can abstract this
                const mockPool = {
                    connect: async () => {
                        return {
                            query: async () => {
                                throw mockError // simulating a request resulting in an error
                            },
                            release: () => {} // mocks the release method of a pool
                        }
                    }
                }
                await assert.isRejected(getAllFromDatabase(mockPool, "categories"), mockError);
            });
        });
        describe("addToDatabase", () => {
            it("adds the new item to the table", async () => {
                // have mock database as javascript object
                const mockDatabase = {
                    categories: [
                        { id: 1, category_name: "Dairy" },
                        { id: 2, category_name: "Grains" }
                    ],
                    checklist: [],
                    inventory: [],
                };

                // mock data for item i want to add. Not testing transformation but simply adding a new item
                const testItem = { id: 3, category_name: "Vegetables" };

                //mock connection pool which adds to table
                const mockPool = {
                    connect: async () => {
                        return {
                            query: async (query) => {
                                // Extract the table name from the query
                                const tableName = query.split('INTO ')[1].split(' ')[0];
                                // Mock the addition of the new item to the respective table in mockDatabase
                                mockDatabase[tableName].push(testItem);
                                // return the last added item
                                return mockDatabase[tableName][mockDatabase[tableName].length - 1];
                            },
                            release: () => {} // mocks the release method of a pool
                        }
                    }
                }
                //run function 
                const addedItem = await addToDatabase(mockPool, "checklist", testItem)
                //verify that item is now in database 
                assert.deepEqual(addedItem, testItem);
            });
            it("throws an error correctly", async () => {
                // mock data for new item 
                const testItem = { id: 3, category_name: "Vegetables" };

                const mockError = new Error('test error'); // Used for our mock DB to throw

                const mockPool = {
                    connect: async () => {
                        return {
                            query: async (query) => {
                                throw mockError; //simulating a request resulting in an error
                            },
                            release: () => {} // mocks the release method of a pool
                        }
                    }
                }
                // const addedItem = await (addToDatabase(mockPool, "categories", testItem), mockError)
                await assert.isRejected(addToDatabase(mockPool, "categories", testItem), mockError);
                //this is passing without me checking that it handles errors
                //might have to check this in the higher level i.e. addNewItem in controller
            })
        })
    })
})

describe('Controller Function tests', () => {
    describe("General Controller functions", () => {
        describe("GetAllItems", () => {
            let getAllFromDatabaseStub;
            const dummyTable = "checklist"; //feels a little bit like coupling as test knows about checklist. Could fix this by putting validation at higher levels of the code e.g. route validation
            const mockItems = [
                { id: 1, category_name: "Dairy"},
                { id: 2, category_name: "Grains"}
            ]

            beforeEach(function () {
                //create a sinon stub for getAllFromDatabase
                getAllFromDatabaseStub = sinon.stub(model, 'getAllFromDatabase');
            })
            afterEach(function () {
                //restore the original function to avoid affecting other tests
                getAllFromDatabaseStub.restore();
            });

            it("returns all items correctly", async () => {
                //sinon stub for getAllFromDatabase that resolves with the items 
                getAllFromDatabaseStub.resolves(mockItems);
                
                //call the function to be tested which will use the stubbed function
                const items = await getAllItems(dummyTable);
                
                assert.deepEqual(items, mockItems); //assert that items match the mocked data  
                await assert.isFulfilled(getAllItems(dummyTable)); //asserting no error occurred
            });

            it("handles an error from the db correctly", async () => {
                //set up
                const mockError = new Error('test error');

                //sinon stub for getAllFromDatabase that throws an error
                getAllFromDatabaseStub.throws(mockError);

                //assert the promise is rejected and the mock error thrown
                await assert.isRejected(getAllItems(dummyTable), mockError);
            });

            it("throws an error if no table name is specified", async () => { //validating this here because it isnt an input from the client. This makes sure backend works!
                //setup 
                const emptyTable = "";
            
                //sinon stub for getAllFromDatabase that resolves with the items 
                getAllFromDatabaseStub.resolves(mockItems);
                
                //assert the promise is rejected and the appropriate error thrown
                await assert.isRejected(getAllItems(emptyTable), noTableError);
            });

            it("throws an error when a non-existent table is specified", async () => { //validating this here because it isnt an input from the client. This makes sure backend works!
                //setup 
                const nonExistentTable = "banana";
            
                //sinon stub for getAllFromDatabase that resolves with the items  
                getAllFromDatabaseStub.resolves(mockItems);
                
                //assert the promise is rejected and the appropriate error thrown
                await assert.isRejected(getAllItems(nonExistentTable), nonExistentTableError);
            });
        });
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
        })
    })
})

//include describe block for validate functions
//it rejects invalid category item 
    //could be a getCategory function to validate 




/* Questions
1. How to show expected vs actual in failing tests all the time when not using Assert to check .
2. is it better to lump like
     describe('Shopping List', function() {
  it('should list items on GET', function(done) {
chai.request(app)
  .get('/items')
  .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json; // jshint ignore:line
    res.body.should.be.a('array');
    res.body.should.have.length(3);
    res.body[0].should.be.a('object');
    res.body[0].should.have.property('id');
    res.body[0].should.have.property('name');
    res.body[0].id.should.be.a('number');
    res.body[0].name.should.be.a('string');
    res.body[0].name.should.equal('Broad beans');
    res.body[1].name.should.equal('Tomatoes');
    res.body[2].name.should.equal('Peppers');
    done();
  });
   });
3. How can I close a server after tests are complete
*/