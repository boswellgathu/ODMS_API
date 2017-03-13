import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../models';
import UserSeed from '../SeedData/UserSeed';
// import app from '../../server';
const app = require('../../server');
const should = chai.should();
const expect = require('chai').expect;

chai.use(chaiHttp);

describe('/POST Users', () => {
  it('it should create a new user', (done) => {
    chai.request(app)
      .post('/api/user')
      .send({
        email: "johndoe@gmail.com",
        password: "youcantseeme",
        password_confirmation: "youcantseeme",
        firstName: "John",
        lastName: "doe",
        roleId: 1
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('token');
        res.body.should.have.property('message').eql('User created Succesfully');
        expect(res.body.user.email).eql('johndoe@gmail.com');
        done();
      });
  });

  it('it should not create a user with an existing email', (done) => {
    chai.request(app)
      .post('/api/user')
      .send({
        email: "johndoe@gmail.com",
        password: "rT$^qweet#2t",
        password_confirmation: "rT$^qweet#2t",
        firstName: "Jane",
        lastName: "Mary",
        roleId: 1
      })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.name).to.contain("SequelizeUniqueConstraintError");
        expect(res.body.errors[0].message).to.contain("email must be unique");
        done();
      });
  });

  it('it should not create a user if password and password_confirmation do not match', (done) => {
    chai.request(app)
      .post('/api/user')
      .send({
        email: "finhost@gmail.com",
        password: "onepassword",
        password_confirmation: "diffpassword",
        firstName: "Fin",
        lastName: "Host",
        roleId: 1
      })
      .end((err, res) => {
        res.should.have.status(400);
        // expect(res.body.name).to.contain("SequelizeUniqueConstraintError");
        // expect(res.body.errors[0].message).to.contain("email must be unique");
        done();
      });
  });

  it('it should not create a user if password length is less than 6 characters', (done) => {
    chai.request(app)
      .post('/api/user')
      .send({
        email: "JrHarmony@gmail.com",
        password: "one",
        password_confirmation: "one",
        firstName: "Jr",
        lastName: "Harmony",
        roleId: 1
      })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.name).to.contain("SequelizeValidationError");
        expect(res.body.errors[0].message).to.contain("password must have six or more characters");
        done();
      });
  });

  it('it should login a user', (done) => {
    chai.request(app)
      .post('/api/user/login')
      .send({
        email: "johndoe@gmail.com",
        password: "youcantseeme",
      })
      .end((err, res) => {
        res.should.have.status(201);
        // expect(res.body.name).to.contain("SequelizeValidationError");
        // expect(res.body.errors[0].message).to.contain("password must have six or more characters");
        done();
      });
  });
});

/*
 * Test the /GET route
 */
// describe('/GET Users', () => {
//   it('it should GET all the users', (done) => {
//     chai.request(app)
//       .get('/api/role')
//       .end((err, res) => {
//         console.log(err);
//         res.should.have.status(200);
//         res.body.should.be.a('array');
//         done();
//       });
//   });
// });
