

let mongoose = require("mongoose");
let Student = require('../src/app/models/student.model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Stuents', () => {
    beforeEach((done) => { //Before each test we empty the database
        Student.remove({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */
    describe('/GET student', () => {
        it('it should GET all the books', (done) => {
            chai.request(server)
                .get('/students')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});