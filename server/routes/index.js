const userController = require('../controllers').users;
const roleController = require('../controllers').roles;
const docController = require('../controllers').documents;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Docs API!',
  }));

  app.post('/api/user', userController.create);
  app.get('/api/user', userController.list);
  app.get('/api/user/:UserId', userController.retrieve);
  app.put('/api/user/:UserId/update', userController.update);
  app.delete('/api/user/:UserId/delete', userController.destroy);
  app.post('/api/role', roleController.create);
  app.post('/api/documents', docController.create);
  app.get('/api/documents', docController.list);
  app.get('/api/documents/:DocId', docController.retrieve);
  app.put('/api/documents/:DocId', docController.update);
  app.delete('/api/documents/:DocId', docController.destroy);
  app.get('/api/users/:UserId/documents', docController.RetrieveDocsByUser);

};
