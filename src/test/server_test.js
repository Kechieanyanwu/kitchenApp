const {assert} = require('chai');
const request = require("supertest");
const server = require("../server"); //where you imported


describe("server testing", () => {
    describe("loading express", () => {
        it("responds to /", async function testslash() {
            const response = await request(server)
            .get("/");
            assert.equal(response.status, 200);
            assert.equal(response.body, "Hello World");
        });
    
    });
    describe("categories endpoint", () => {
        it("routes correctly", async () => {
            const response = await request(server)
            .get("/categories");
            assert.equal(response.status, 200);
            assert.equal(response.body, "Categories endpoint");
        })
    })
})
