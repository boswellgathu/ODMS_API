/**
 * Created by boswellgathu on 30/03/2017.
 */
const express = require('express');
const UserController = require('../controllers/UserController');
const AuthHandler = require('../controllers/AuthHandler');

const UserRouter = express.Router();

const IsAdmin = AuthHandler.VerifyAdmin;
const IsUser = AuthHandler.VerifyUser;
const Auth = AuthHandler.VerifyToken;

UserRouter.post('/users', UserController.CreateUser);
UserRouter.post('/users/login', UserController.Login);
UserRouter.post('/users/logout', UserController.Logout);
UserRouter.get('/users', Auth, IsAdmin, UserController.ListUsers);
UserRouter.get('/users/:UserId', Auth, IsUser, UserController.RetrieveUser);
UserRouter.get('/search/users', Auth, IsUser, UserController.SearchUsers);
UserRouter.put('/users/:UserId/update', Auth, IsUser, UserController.UpdateUser);
UserRouter.delete('/users/:UserId/delete', Auth, IsAdmin, UserController.DeleteUser);

module.exports = UserRouter;
