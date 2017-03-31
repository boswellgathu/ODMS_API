const RoleController = require('../controllers/RoleController');
const AuthHandler = require('../controllers/AuthHandler');
const express = require('express');
const Router = express.Router();

const IsAdmin = AuthHandler.VerifyAdmin;
const IsUser = AuthHandler.VerifyUser;
const Auth = AuthHandler.VerifyToken;
const RoleRouter = express.Router();


RoleRouter.post('/role', RoleController.CreateRole);
RoleRouter.get('/role', RoleController.GetRoles);

module.exports = RoleRouter;
