import UserController from '../controllers/user'
import RoleController from '../controllers/role'
import DocController from '../controllers/document'

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Docs API!',
  }));

  app.post('/api/user', UserController.CreateUser);
  app.get('/api/user', UserController.ListUsers);
  app.get('/api/user/:UserId', UserController.RetrieveUser);
  app.put('/api/user/:UserId/update', UserController.UpdateUser);
  app.delete('/api/user/:UserId/delete', UserController.DeleteUser);
  app.post('/api/role', RoleController.create);
  app.post('/api/documents', DocController.CreateDoc);
  app.get('/api/documents', DocController.ListDocs);
  app.get('/api/documents/:DocId', DocController.GetDocs);
  app.put('/api/documents/:DocId', DocController.UpdateDoc);
  app.delete('/api/documents/:DocId', DocController.DeleteDoc);
  app.get('/api/users/:UserId/documents', DocController.RetrieveDocsByUser);

};
