/**
 * Created by boswellgathu on 30/03/2017.
 */
const express = require('express');
const DocController = require('../controllers/DocController');
const AuthHandler = require('../controllers/AuthHandler');

const IsAdmin = AuthHandler.VerifyAdmin;
const IsUser = AuthHandler.VerifyUser;
const Auth = AuthHandler.VerifyToken;
const DocRouter = express.Router();


DocRouter.post('/documents', Auth, IsUser, DocController.CreateDoc);
DocRouter.get('/documents', DocController.ListDocs);
DocRouter.get('/documents/:DocId', Auth, IsUser, DocController.GetDoc);
DocRouter.get('/search/documents', Auth, IsUser, DocController.SearchDocs);
DocRouter.put('/documents/:DocId', Auth, IsUser, DocController.UpdateDoc);
DocRouter.delete('/documents/:DocId', Auth, IsUser, DocController.DeleteDoc);
DocRouter.get('/users/:UserId/documents', Auth, IsUser, DocController.RetrieveDocsByUser);

module.exports = DocRouter;
