import {
  UserController,
  RoleController,
  DocController,
  AuthHandler
} from '../controllers'

const Admin = AuthHandler.VerifyAdmin;
const User = AuthHandler.VerifyUser;
const Auth = AuthHandler.VerifyToken;

export default function(app) {
  app.post('/api/user', UserController.CreateUser);
  app.get('/api/user', Auth, Admin, UserController.ListUsers);
  app.get('/api/user/:UserId', Auth, User, UserController.RetrieveUser);
  app.put('/api/user/:UserId/update', Auth, User, UserController.UpdateUser);
  app.delete('/api/user/:UserId/delete', Auth, Admin, UserController.DeleteUser);
  app.post('/api/user/login', UserController.Login);
  app.post('/api/user/logout', UserController.Logout);
  app.post('/api/role', RoleController.CreateRole);
  app.get('/api/role', RoleController.GetRoles);
  app.post('/api/documents', Auth, User, DocController.CreateDoc);
  app.get('/api/documents', DocController.ListDocs);
  app.get('/api/documents/:DocId', Auth, User, DocController.GetDocs);
  app.put('/api/documents/:DocId', Auth, User, DocController.UpdateDoc);
  app.delete('/api/documents/:DocId', Auth, User, DocController.DeleteDoc);
  app.get('/api/users/:UserId/documents', Auth, User, DocController.RetrieveDocsByUser);
};
