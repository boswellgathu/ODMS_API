const chai = require('chai');
const chaiHttp = require('chai-http');
const UserController = require('../controllers/UserController');
const app = require('../../server');
const should = chai.should();
const expect = require('chai').expect;

const user = {
  roleId: 1,
  email: 'johndoeNew@gmail.com',
  id: 1
};
const token = UserController.GenerateToken(user);

chai.use(chaiHttp);

describe('/POST Documents', () => {
  it('it should create a new document', (done) => {
    chai.request(app)
      .post('/api/documents')
      .set('x-access-token', token)
      .send({
        title: "The Great Air Storm",
        content: "This is the beginning of everything, the beginning itself began here",
        userId: user.id,
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Document created succesfully');
        expect(res.body.document.title).eql("The Great Air Storm");
        done();
      });
  });

  it('it should not create a new document if userId is not provided or is invalid', (done) => {
    chai.request(app)
      .post('/api/documents')
      .set('x-access-token', token)
      .send({
        title: "I am real",
        content: "Dont get me confused",
        userId: 99
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('name').eql('SequelizeForeignKeyConstraintError');
        done();
      });
  });

  it('it should create a new document with private access when access is not provided', (done) => {
    chai.request(app)
      .post('/api/documents')
      .set('x-access-token', token)
      .send({
        title: "The all time goal",
        content: "Get to wall street top floor",
        userId: user.id
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Document created succesfully');
        expect(res.body.document.access).eql("private");
        done();
      });
  });

  it('it should create a new document with public access when access is provided', (done) => {
    chai.request(app)
      .post('/api/documents')
      .set('x-access-token', token)
      .send({
        title: "Misfortunes calendar",
        content: "content goes here",
        userId: user.id,
        access: "public"
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Document created succesfully');
        expect(res.body.document.access).eql("public");
        done();
      });
  });

  it('it should not create a new document when access provide is nether "public" nor "private"', (done) => {
    chai.request(app)
      .post('/api/documents')
      .set('x-access-token', token)
      .send({
        title: "Maritos Comments",
        content: "Comments from the mariatos",
        userId: user.id,
        access: "notValid"
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('name').eql('SequelizeDatabaseError');
        expect(res.body.message).eql('invalid input value for enum "enum_Documents_access": "notValid"');
        done();
      });
  });

  it('it should not create a new document when neither title or content is provided', (done) => {
    chai.request(app)
      .post('/api/documents')
      .set('x-access-token', token)
      .send({
        content: "Comments from the mariatos",
        userId: user.id
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('name').eql('SequelizeValidationError');
        expect(res.body.message).eql('notNull Violation: title cannot be null');
        done();
      });
  });

});

describe('/GET Documents', () => {
  it('it should GET all documents which are public', (done) => {
    chai.request(app)
      .get('/api/documents')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        expect(res.body.length).eql(1);
        expect(res.body[0].title).eql("Misfortunes calendar");
        expect(res.body[0].access).eql("public");
        expect(res.body[0].id).eql(4);
        expect(res.body[0].userId).eql(1);
        done();
      });
  });

  it('it should GET documents specified by the offset and limit query', (done) => {
    chai.request(app)
      .get('/api/documents')
      .query({
        limit: 5,
        offset: 0
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.length).eql(1);
        done();
      });
  });

  it('it should return a message if no documents are returned', (done) => {
    chai.request(app)
      .get('/api/documents')
      .query({
        limit: 5,
        offset: 1
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).eql('No documents exist currently');
        done();
      });
  });

  it('it should fail if either offset or limit is not an integer', (done) => {
    chai.request(app)
      .get('/api/documents')
      .query({
        limit: 'number',
        offset: 1
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('name').eql('SequelizeDatabaseError');
        expect(res.body.message).eql('invalid input syntax for integer: "number"');
        done();
      });
  });

  it('it should GET all documents of a certain user when the userId is provided', (done) => {
    chai.request(app)
      .get('/api/users/' + user.id + '/documents' )
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        expect(res.body.length).eql(3);
        done();
      });
  });

  it('it should not GET documents of a certain user when the userId is invalid', (done) => {
    chai.request(app)
      .get('/api/users/' + 90 + '/documents' )
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('message').eql('No Documents found');
        done();
      });
  });

  it('it should GET a document when the DocId is specified', (done) => {
    chai.request(app)
      .get('/api/documents/4' )
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body.title).eql("Misfortunes calendar");
        expect(res.body.access).eql("public");
        expect(res.body.id).eql(4);
        expect(res.body.userId).eql(1);
        done();
      });
  });

  it('it should not GET a document when the DocId specified is invalid', (done) => {
    chai.request(app)
      .get('/api/documents/95' )
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('message').eql('Document not found');
        done();
      });
  });

it('it should not GET a document when the DocId specified is not an integer', (done) => {
    chai.request(app)
      .get('/api/documents/string' )
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.name).eql('SequelizeDatabaseError');
        res.body.should.have.property('message').eql('invalid input syntax for integer: "string"');
        done();
      });
  });
});

describe('/PUT Documents', () => {
  it('it should UPDATE a document when the DocId is specified', (done) => {
    chai.request(app)
      .put('/api/documents/4')
      .set('x-access-token', token)
      .send({
        title: 'Updated Doc Title'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body.title).eql("Updated Doc Title");
        expect(res.body.access).eql("public");
        expect(res.body.id).eql(4);
        expect(res.body.userId).eql(1);
        done();
      });
  });

  it('it should not UPDATE a document when the DocId specified is invalid', (done) => {
    chai.request(app)
      .put('/api/documents/90')
      .set('x-access-token', token)
      .send({
        title: 'Updated Doc Title'
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('message').eql('Document not found');
        done();
      });
  });

  it('it should not UPDATE a document when the DocId specified is not an integer', (done) => {
    chai.request(app)
      .put('/api/documents/string')
      .set('x-access-token', token)
      .send({
        title: 'Updated Doc Title'
      })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.name).eql('SequelizeDatabaseError');
        res.body.should.have.property('message').eql('invalid input syntax for integer: "string"');
        done();
      });
  });


});

describe('/search Documents', () => {
  it('it should search documents given a query', (done) => {
    chai.request(app)
      .get("/api/search/documents/")
      .set('x-access-token', token)
      .query({
        doctitle: 'title'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        expect(res.body[0].title).eql("Updated Doc Title");
        expect(res.body[0].access).eql("public");
        expect(res.body[0].id).eql(4);
        expect(res.body[0].userId).eql(1);
        done();
      });
  });

  it('it should return a message if no ducuments match the query', (done) => {
    chai.request(app)
      .get("/api/search/documents/")
      .set('x-access-token', token)
      .query({
        doctitle: 'bulaah'
      })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.message).eql("No documents match that search criteria");
        done();
      });
  });
});

describe('/DELETE Documents', () => {
  it('it should DELETE a document when the DocId is specified', (done) => {
    chai.request(app)
      .delete('/api/documents/3')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).eql("The all time goal has been deleted succesfully");
        done();
      });
  });

  it('it should not DELETE a document when the DocId specified is invalid', (done) => {
    chai.request(app)
      .delete('/api/documents/90')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('message').eql('Document not found');
        done();
      });
  });

  it('it should not DELETE a document when the DocId specified is not an integer', (done) => {
    chai.request(app)
      .delete('/api/documents/string')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.name).eql('SequelizeDatabaseError');
        res.body.should.have.property('message').eql('invalid input syntax for integer: "string"');
        done();
      });
  });
});
