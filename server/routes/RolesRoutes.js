const RoleController = require('../controllers/RoleController');
const AuthHandler = require('../controllers/AuthHandler');
const express = require('express');

const IsAdmin = AuthHandler.VerifyAdmin;
const Auth = AuthHandler.VerifyToken;
const RoleRouter = express.Router();


RoleRouter.post('/roles', Auth, IsAdmin, RoleController.CreateRole);
RoleRouter.get('/roles', Auth, IsAdmin, RoleController.GetRoles);
RoleRouter.put('/roles/:roleId', Auth, IsAdmin, RoleController.UpdateRole);
RoleRouter.delete('/roles/:roleId', Auth, IsAdmin, RoleController.DeleteRole);

module.exports = RoleRouter;
