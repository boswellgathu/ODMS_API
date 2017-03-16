import chai from 'chai';
import chaiHttp from 'chai-http';
import UserController from '../controllers/UserController';
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
        res.body.should.have.property('message').eql('User created Succesfully');
        expect(res.body.user.email).eql('johndoe@gmail.com');
        done();
      });
  });

  it('it should make sure a token is creating when a new user is created', (done) => {
    chai.request(app)
      .post('/api/user')
      .send({
        email: "janekim@gmail.com",
        password: "rT$^qweet#2t",
        password_confirmation: "rT$^qweet#2t",
        firstName: "Jane",
        lastName: "Kim",
        roleId: 1
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('token');
        res.body.should.have.property('message').eql('User created Succesfully');
        expect(res.body.user.email).eql('janekim@gmail.com');
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

  it('it should not create a user if email is invalid', (done) => {
    chai.request(app)
      .post('/api/user')
      .send({
        email: "Invalidemail.com",
        password: "onetwo",
        password_confirmation: "onetwo",
        firstName: "Jr",
        lastName: "Harmony",
        roleId: 1
      })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.name).to.contain("SequelizeValidationError");
        expect(res.body.errors[0].message).to.contain("Email address must be valid");
        done();
      });
  });

  it('it should login a user and generate a jwt token for the user', (done) => {
    chai.request(app)
      .post('/api/user/login')
      .send({
        email: "johndoe@gmail.com",
        password: "youcantseeme",
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('token');
        expect(res.body.message).to.contain("User Login Succesfull");
        done();
      });
  });

  it('it should not login a user with wrong password', (done) => {
    chai.request(app)
      .post('/api/user/login')
      .send({
        email: "johndoe@gmail.com",
        password: "WRONGPASSWORD",
      })
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.message).to.contain("Wrong Password");
        done();
      });
  });

  it('it should not login a user with a wrong email ', (done) => {
    chai.request(app)
      .post('/api/user/login')
      .send({
        email: "WRONGEMAIL@gmail.com",
        password: "WRONGPASSWORD",
      })
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.message).to.contain("Email does not Exist");
        done();
      });
  });
});

/*
 * Test the /GET route
 */
const user = {
  roleId: 1,
  email: 'johndoe@gmail.com',
  id: 1
};
const token = UserController.GenerateToken(user);

describe('/GET Users', () => {
  it('it should GET all the users when a token is provided', (done) => {
    chai.request(app)
      .get('/api/user')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        expect(res.body.length).eql(2);
        done();
      });
  });

  it('it should not get users if no token is provided', (done) => {
    chai.request(app)
      .get('/api/user')
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.message).to.contain("No token provided");
        done();
      });
  });

  it('it should Get a secific user given the userId', (done) => {
    chai.request(app)
      .get('/api/user/' + user.id)
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.email).eql("johndoe@gmail.com");
        done();
      });
  });

  it('it should return a message if the userId given is invalid', (done) => {
    chai.request(app)
      .get('/api/user/' + 59)
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).eql("user Not Found");
        done();
      });
  });
});

/*
 * Test the /PUT route
 */
describe('/PUT users', () => {
  it('It should update a users details', (done) => {
    chai.request(app)
      .put('/api/user/' + user.id + '/update')
      .set('x-access-token', token)
      .send({
        email: "johndoeNew@gmail.com",
        lastName: "doeNew"
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.email).eql("johndoeNew@gmail.com");
        expect(res.body.lastName).eql("doeNew");
        done();
      });
  });

  it('It should return a message when the user is not found', (done) => {
    chai.request(app)
      .put('/api/user/' + 30 + '/update')
      .set('x-access-token', token)
      .send({
        email: "usernotfoundw@gmail.com",
        lastName: "unknownuser"
      })
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).eql("user Not Found");
        done();
      });
  });
});

/*
 * Test the /delete route
 */
describe('/delete users', () => {
  it('It should delete a user given a userId', (done) => {
    chai.request(app)
      .delete('/api/user/' + 2 + '/delete')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).eql("janekim@gmail.com has been deleted succesfully");
        done();
      });
  });

  it('It should return a message when the user is not found', (done) => {
    chai.request(app)
      .delete('/api/user/' + 30 + '/delete')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).eql("user Not Found");
        done();
      });
  });
});
