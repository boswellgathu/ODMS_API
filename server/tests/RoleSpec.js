import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../models';
// import app from '../../server';
const app = require('../../server');
const Role = db.role;
const should = chai.should();
const expect = require('chai').expect;

chai.use(chaiHttp);
/*
 * Test the /GET route
 */
describe('/GET Roles', () => {
  it('it should GET all the roles', (done) => {
    chai.request(app)
      .get('/api/role')
      .end((err, res) => {
        console.log(err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  it('it should create a new role', (done) => {
    chai.request(app)
      .post('/api/role')
      .send({
        title: "user"
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        done();
      });
  });

  it('it should not create an invalid role', (done) => {
    chai.request(app)
      .post('/api/role')
      .send({
        tgtle: "user"
      })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.name).to.contain("SequelizeValidationError");
        expect(res.body.errors[0].message).to.contain("title cannot be null");
        done();
      });
  });
});
