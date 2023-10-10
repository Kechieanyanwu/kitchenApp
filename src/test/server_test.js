const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');
const assert = chai.assert;
const should = chai.should(); //note, you have to actually call the function
const expect = chai.expect;
const request = require("supertest");
const {app, server} = require("../server"); 
const { after } = require('node:test');
const model = require('../models/model'); //general import as you can't destructure when stubbing with sinon
const getAllFromDatabase = model.getAllFromDatabase;
const categoriesSchema = model.categoriesSchema;
const checklistSchema = model.checklistSchema;
const inventorySchema = model.inventorySchema;
const { getAllItems } = require('../controllers/controller');

chai.use(require('chai-json-schema-ajv')); //for validating JSON schema
chai.use(require('chai-as-promised')); //extends chai to handle promises 


//need to find a way to close server after the tests are complete; could us AfterAll
describe("server testing", () => {
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

    describe("Endpoint testing", () => {
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
            describe(`${endpoint.name} endpoint`, () => {
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
            });
        }
    })
});

describe('database function testing', () => {
    describe("general model", () => {
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
            
        })
    })
    describe('Controller Function tests', () => {
        describe("General Controller functions", () => {
            describe("GetAllItems", () => {
                it("returns all items correctly", async () => { //is an async function so wil think 
                    //set up dummy tables and mock items
                    const dummyTable = "random";
                    const mockItems = [
                        { id: 1, category_name: "Dairy"},
                        { id: 2, category_name: "Grains"}
                    ]

                    //create a sinon stub for getAllFromDatabase
                    const getAllFromDatabaseStub = sinon.stub(model, 'getAllFromDatabase');
                    getAllFromDatabaseStub.resolves(mockItems);
                    
                    //call the function to be tested which will use the stubbed function
                    const items = await getAllItems(dummyTable);
                    
                    //assert that items match the mocked data  
                    assert.deepEqual(items, mockItems); //what I want to assert

                    //restore the original function to avoid affecting other tests
                    getAllFromDatabaseStub.restore();
                })
            })
            //next step is to handle errors;
        })
    })
    // describe("checklist model", () => {
    //     describe("getAllChecklist", () => {
 
    //     })
    // })
})





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
4. Is the right way to build out all the endpoints together, or focus on one per time?
*/