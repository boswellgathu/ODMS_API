const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
const should = chai.should();
const expect = require('chai').expect;
const UserController = require('../controllers/UserController');

chai.use(chaiHttp);

const user = {
  roleId: 1,
  email: 'johndoe@gmail.com',
  id: 1
};
const token = UserController.GenerateToken(user);

/*
 * Test the /POST route
 */
describe('/POST Roles', () => {
  it('it should create a new role', (done) => {
    chai.request(app)
      .post('/api/roles')
      .set('x-access-token', token)
      .send({
        title: "user"
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        done();
      });
  });

  it('it should create a new role', (done) => {
    chai.request(app)
      .post('/api/roles')
      .set('x-access-token', token)
      .send({
        title: "admin"
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        done();
      });
  });

  it('it should not create an invalid role', (done) => {
    chai.request(app)
      .post('/api/roles')
      .set('x-access-token', token)
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

/*
 * Test the /GET route
 */
describe('/GET Roles', () => {
  it('it should GET all the roles', (done) => {
    chai.request(app)
      .get('/api/roles')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });
});

