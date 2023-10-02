const chai = require('chai');
const assert = chai.assert;
const should = chai.should(); //have to actually call the function 
const expect = chai.expect;
const request = require("supertest");
const {app, server} = require("../server"); //where you imported
const { after } = require('node:test');

chai.use(require('chai-json-schema-ajv'));


//QUESTIONS FOR CHIDI: 
    //HOW CAN I CLOSE A SERVER AFTER THE TESTS ARE COMPLETE? 
    //need to find a way to close server after the tests are complete; could us AfterAll
describe("server testing", () => {
    after((done) => {
        server.close(() => {
            console.log("Server closed"); // never reaching this endpoint
            done();
        });

    });

    describe("loading express", () => {
        it("responds to /", async function testslash() {
            const response = await request(server)
            .get("/");
            assert.equal(response.status, 200);
            assert.equal(response.body, "Hello World");
        });
    
    });
    /* a lot of repetition below, is it better to lump like
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
   */
     
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
            // expect(response.body).to.have.property("id");
            // expect(response.body).to.have.property("category_name");

            });
            it("has the correct fields in the JSON response body", async () => { //do i need this? Feels like a duplicate of previous test
                // expect(response).to.have.property("id");
                // expect(response).to.have.property("category_name");
                // shape is category id and category_name
                // so possibly start by sending dummy data, then will build out database connections later 
            });
            it("sends no data when the table is empty", async () => {
            // should I test that it sends no data when nothing in table?
            })            
        })
    });
    describe("checklist endpoint", () => {
        it("routes correctly", async () => {
            const response = await request(server)
            .get("/checklist");
            assert.equal(response.status, 200);
            assert.equal(response.body, "Checklist endpoint"); //code smell; could also create variables for the endpoint name
        })
    });
    describe("inventory endpoint", () => {
        it("routes correctly", async () => {
            const response = await request(server)
            .get("/inventory");
            assert.equal(response.status, 200);
            assert.equal(response.body, "Inventory endpoint"); //code smell; could also create variables for the endpoint name
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
1. How to show expected vs actual. 
*/