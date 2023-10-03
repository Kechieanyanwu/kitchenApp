const chai = require('chai');
const assert = chai.assert;
const should = chai.should(); //have to actually call the function 
const expect = chai.expect;
const request = require("supertest");
const {app, server} = require("../server"); //where I last imported
const { after } = require('node:test');
const { getAllFromDatabase } = require('../models/categoriesModel');

chai.use(require('chai-json-schema-ajv')); //for validating JSON schema 


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

     
    describe("categories endpoint", () => {
        it("routes correctly", async () => { // is there a better way of checking that it routes there? Or should I not? 
            const response = await request(server)
            .get("/categories");
            assert.equal(response.status, 200);
        });
        describe("GET Categories", () => {
            it("sends a 200 request on good request", async () => {
                const response = await request(server)
                .get("/categories");
                assert.equal(response.status, 200);
            });
            it("sends JSON response with correct schema", async() => { // test that it sends the JSON with the right shape 
                const response = await request(server)
                .get("/categories");
                assert.equal(response.status, 200);            
                assert.jsonSchema(response.body, categoriesSchema);
            });
            it("has only two properties", async () => {
                const response = await request(server)
                .get("/categories");
                assert.equal(response.status, 200);
                const responseBody = Array.isArray(response.body) ? response.body : [response.body];
                responseBody.forEach((item) => {
                    assert.equal(Object.keys(item).length, 2)
                })
            })
            /*
            it("sends no data when the table is empty", async () => {
            How should I test that it sends no data when nothing in table?
            Might be something to do when I mock database 
            })
            */            
        })
    });
    describe("checklist endpoint", () => {
        it("routes correctly", async () => {
            const response = await request(server)
            .get("/checklist");
            assert.equal(response.status, 200);
        })
    });
    describe("inventory endpoint", () => {
        it("routes correctly", async () => {
            const response = await request(server)
            .get("/inventory");
            assert.equal(response.status, 200);
        })
    })
});

describe('database function testing', () => {
    describe('categories model', () => {
        describe("getAllFromDatabase", () => { //might just make this a general function tbh. Let's see
            it('returns data from a successful db query', async () => {
   
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
                //pass the mockPool to getAllFromDatabase
                const response = await getAllFromDatabase(mockPool) //update to pools
                assert.deepEqual(response, mockCategoriesList);
            })
        })

    })
})



// good design would be to put this in the models file and export. Later
const categoriesSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            id: {type: "number"},
            category_name: {type: "string"},
        },
        required: ["id", "category_name"],
    },
};

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