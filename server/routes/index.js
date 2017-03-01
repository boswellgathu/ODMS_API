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
  app.post('/api/user/:UserId/update', userController.update);
  app.post('/api/role', roleController.create);
  app.post('/api/document', docController.create);

};
