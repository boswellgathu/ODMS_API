const chai = require('chai');
const chaiHttp = require('chai-http');
const UserController = require('../controllers/UserController');
const app = require('../../server');
const should = chai.should();
const expect = require('chai').expect;

chai.use(chaiHttp);

/*
 * Test the /POST route
 */
describe('/POST Users', () => {
  it('it should create a new user', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({
        email: "johndoe@gmail.com",
        password: "youcantseeme",
        password_confirmation: "youcantseeme",
        userName: "johndoe",
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

  it('it should make sure a token is created when a new user is created', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({
        email: "janekim@gmail.com",
        password: "rT$^qweet#2t",
        password_confirmation: "rT$^qweet#2t",
        userName: "janekim",
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
      .post('/api/users')
      .send({
        email: "johndoe@gmail.com",
        password: "rT$^qweet#2t",
        password_confirmation: "rT$^qweet#2t",
        userName: "existingmail",
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
      .post('/api/users')
      .send({
        email: "finhost@gmail.com",
        password: "onepassword",
        password_confirmation: "diffpassword",
        userName: "finhost",
        firstName: "Fin",
        lastName: "Host",
        roleId: 1
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('it should not create a user if password length is less than 6 characters', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({
        email: "JrHarmony@gmail.com",
        password: "one",
        password_confirmation: "one",
        userName: "jrharmony",
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
      .post('/api/users')
      .send({
        email: "Invalidemail.com",
        password: "onetwo",
        password_confirmation: "onetwo",
        userName: "jrmony",
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
      .post('/api/users/login')
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
      .post('/api/users/login')
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
      .post('/api/users/login')
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

  it('it should not login a user when either password or email is not provided', (done) => {
    chai.request(app)
      .post('/api/users/login')
      .send({
        email: "johndoe@gmail.com"
      })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.error.text).to.contain('Incorrect arguments');
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
      .get('/api/users')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        expect(res.body.length).eql(2);
        done();
      });
  });

  it('it should GET users specified by the offset and limit', (done) => {
    chai.request(app)
      .get('/api/users/?limit=5&&offset=1')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        expect(res.body.length).eql(1);
        done();
      });
  });

  it('it should return a message when no users are found while using offset and or limit', (done) => {
    chai.request(app)
      .get('/api/users/?limit=5&&offset=3')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).eql("No users exist currently");
        done();
      });
  });

  it('it should not get users if no token is provided', (done) => {
    chai.request(app)
      .get('/api/users')
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.message).to.contain("No token provided");
        done();
      });
  });

  it('it should not return users when offset or limit is not an integer', (done) => {
    chai.request(app)
      .get('/api/users/?limit=tfdnng&&offset=the')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).eql('invalid input syntax for integer: "the"');
        done();
      });
  });

  it('it should Get a secific user given the userId', (done) => {
    chai.request(app)
      .get('/api/users/' + user.id)
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.email).eql("johndoe@gmail.com");
        done();
      });
  });

  it('it should return a message if the userId given is invalid', (done) => {
    chai.request(app)
      .get('/api/users/' + 59)
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).eql("user Not Found");
        done();
      });
  });

  it('it should not return a user when userId specified is not integer', (done) => {
    chai.request(app)
      .get('/api/users/' + 'ther')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).eql( 'invalid input syntax for integer: "ther"');
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
      .put('/api/users/' + user.id)
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
      .put('/api/users/' + 30)
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

  it('It should update a user\'s password', (done) => {
    chai.request(app)
      .put('/api/users/' + user.id)
      .set('x-access-token', token)
      .send({
        password: 'updatedPassword',
        password_confirmation: 'updatedPassword'
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.email).eql("johndoeNew@gmail.com");
        expect(res.body.lastName).eql("doeNew");
        done();
      });
  });

  it('It should fail to update a user\'s password when password and password_confirmation do not match', (done) => {
    chai.request(app)
      .put('/api/users/' + user.id)
      .set('x-access-token', token)
      .send({
        password: 'updatedPassword',
        password_confirmation: 'do not match'
      })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('It should fail to update when the userId provided is not an integer', (done) => {
    chai.request(app)
      .put('/api/users/' + 'haha')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).eql('invalid input syntax for integer: "haha"');
        done();
      });
  });

});

/*
 * Test the /search route
 */
describe('/search users', () => {
  it('It should search for users given a query', (done) => {
    chai.request(app)
      .get('/api/search/users')
      .set('x-access-token', token)
      .query({username: 'e'})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.length).eql(2);
        done();
      });
  });

  it('It should return a message when the no users matching the search exist', (done) => {
    chai.request(app)
      .get('/api/search/users')
      .set('x-access-token', token)
      .query({username: 'xxx'})
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).eql("No users match that search criteria");
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
      .delete('/api/users/' + 2)
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).eql("janekim@gmail.com has been deleted succesfully");
        done();
      });
  });

  it('It should return a message when the user is not found', (done) => {
    chai.request(app)
      .delete('/api/users/' + 30)
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.message).eql("user Not Found");
        done();
      });
  });

  it('It should fail if userid provided is not an integer', (done) => {
    chai.request(app)
      .delete('/api/users/' + 'there')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).eql('invalid input syntax for integer: "there"');
        done();
      });
  });

});

/*
 * Test the /logout route
 */
describe('/logout users', () => {
  it('It should logout a user', (done) => {
    chai.request(app)
      .post('/api/users/logout')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).eql("user successfully logged out");
        done();
      });
  });
});


