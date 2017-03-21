const chai = require('chai');
const chaiHttp = require('chai-http');
const UserController = require('../controllers/UserController');
const app = require('../../server');
const should = chai.should();
const expect = require('chai').expect;

chai.use(chaiHttp);


const user = {
  roleId: 2,
  email: 'johndoe@gmail.com',
  id: 1
};
const token = UserController.GenerateToken(user);

describe('VerifyToken Middleware', () => {
  it('it should not Get all users if the token provided is invalid', (done) => {
    chai.request(app)
      .get('/api/users')
      .set('x-access-token', 'qe.JHVJHVHJVFpdf.jvjhvef')
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.message).eql("Failed to authenticate token.");
        done();
      });
  });

  it('it should return a message if no token is provided', (done) => {
    chai.request(app)
      .get('/api/users')
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.message).eql("No token provided.");
        done();
      });
  });
});

describe('VerifyAdmin Middleware', () => {
  it('it should not Get all users if the role provided is not an admin role', (done) => {
    chai.request(app)
      .get('/api/users')
      .set('x-access-token', token )
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.message).eql("You do not have permission to access this");
        done();
      });
  });
});

const UserInvalidRole = {
  roleId: 3,
  email: 'johndoe@gmail.com',
  id: 1
};
const TokenInvalidRole = UserController.GenerateToken(UserInvalidRole);

describe('VerifyUser Middleware', () => {
  it('it should not Get all users if the role provided is not an admin or user role', (done) => {
    chai.request(app)
      .get('/api/users')
      .set('x-access-token', TokenInvalidRole)
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.message).eql("You do not have permission to access this");
        done();
      });
  });
});
