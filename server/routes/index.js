const UserController = require('../controllers/UserController');
const RoleController = require('../controllers/RoleController');
const DocController = require('../controllers/DocController');
const AuthHandler = require('../controllers/AuthHandler');

const Admin = AuthHandler.VerifyAdmin;
const User = AuthHandler.VerifyUser;
const Auth = AuthHandler.VerifyToken;

module.exports = (app) => {
  app.post('/api/users', UserController.CreateUser);
  app.get('/api/users', Auth, Admin, UserController.ListUsers);
  app.get('/api/users/:UserId', Auth, User, UserController.RetrieveUser);
  app.get('/api/search/users', Auth, User, UserController.SearchUsers);
  app.put('/api/users/:UserId/update', Auth, User, UserController.UpdateUser);
  app.delete('/api/users/:UserId/delete', Auth, Admin, UserController.DeleteUser);
  app.post('/api/users/login', UserController.Login);
  app.post('/api/users/logout', UserController.Logout);
  app.post('/api/role', RoleController.CreateRole);
  app.get('/api/role', RoleController.GetRoles);
  app.post('/api/documents', Auth, User, DocController.CreateDoc);
  app.get('/api/documents', DocController.ListDocs);
  app.get('/api/documents/:DocId', Auth, User, DocController.GetDocs);
  app.get('/api/search/documents', Auth, User, DocController.SearchDocs);
  app.put('/api/documents/:DocId', Auth, User, DocController.UpdateDoc);
  app.delete('/api/documents/:DocId', Auth, User, DocController.DeleteDoc);
  app.get('/api/users/:UserId/documents', Auth, User, DocController.RetrieveDocsByUser);
};
