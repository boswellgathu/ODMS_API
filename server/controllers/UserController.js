const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../../config/config');
const UserData = require('./AuthHandler').UserData;

const secret = config.secret;
const User = db.User;
const Document = db.Document;


/**
 * UserController
 *
 * Creates the user controller
 * @class
 */
class UserController {
  /**
   * UserInfo
   *
   * set user info to be used in the token
   *
   * @param {object} user The user object
   * @returns {object} user details to be used in token generation
   */
  static UserInfo(user) {
    let {email, id ,roleId} = user;
    return {roleId, email, id };
  }

  /**
   * GenerateToken
   *
   * Generate a token
   *
   * @param {object} user The user object
   * @returns {string} token
   */
  static GenerateToken(user) {
    return jwt.sign(UserController.UserInfo(user), secret, {
      expiresIn: '24h'
    });
  }

  /**
   * CreateUser
   *
   * creates a user
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res the user object created
   */
  static CreateUser(req, res) {
    if (!req.body.roleId){
      req.body.roleId = 2; // default user role
    }
    return User
      .create(req.body)
      .then((user) => {
        const token = UserController.GenerateToken(user);
        return res.status(201).send({
          message: 'User created Succesfully',
          token: token,
          user: UserData(user)
        });
      })
      .catch( error => {
        return res.status(400).send({
          message: 'There was a problem creating the user',
          Error : UserController.HandleErr(error)
        });
      });
  }

  /**
   * ListUsers
   *
   * list Users
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res list of all users found
   */
  static ListUsers(req, res) {
    if (req.query.limit || req.query.offset) {
      return User
        .findAll({
          limit: req.query.limit,
          offset: req.query.offset
        })
        .then((users) => {
          if (users.length < 1) {
            return res.status(404).send({
              message: 'No users exist currently'
            });
          }
          users.map(UserData);
          return res.status(200).send(users);
        })
        .catch(error => {
          return res.status(400).send({
            message: 'There was a problem with the query params check if they are all numbers',
            Error :  UserController.HandleErr(error)
          });
        });
    }
      return User
      .all()
      .then(users => res.status(200).send(users.map(UserData)))
      .catch(error => res.status(400).send(error));
  }

  /**
   * RetrieveUser
   *
   * get a specific user
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res user object found
   */
  static RetrieveUser(req, res) {
    return User
      .findById(req.params.UserId, {
        include: [{
          model: Document,
          as: 'Documents'
        }],
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'user Not Found',
          });
        }
        return res.status(200).send(UserData(user));
      })
      .catch(error => {
        return res.status(400).send({
          message: 'There was a problem with the userId check if it is a number',
          Error : UserController.HandleErr(error)
        });
      });
  }

  /**
   * UpdateUser
   *
   * update a specific user
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res user object updated
   */
  static UpdateUser(req, res) {
    return User
      .findById(req.params.UserId)
      .then(user => {
        if (UserController.VerifyOwner(req, user)) {
          if (!user) {
            return res.status(404).send({
              message: 'user Not Found',
            });
          }
          return user
            .update(req.body, {
              fields: Object.keys(req.body)
            })
            .then(() => res.status(200).send(UserData(user)))
            .catch((error) => res.status(400).send(error));
        }
        return res.status(401).send({
          message: 'You do not have permission access this data',
        });
        })
      .catch((error) => {
        return res.status(400).send({
          message: 'There was a problem with the userId check if it is a number',
          Error : UserController.HandleErr(error)
        });
      });
  }

  /**
   * DeleteUser
   *
   * Delete a specific user
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res success message
   */
  static DeleteUser(req, res) {
    return User
      .findById(req.params.UserId)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'user Not Found',
          });
        }
        return user
          .destroy()
          .then(() => res.status(200).send({
            message: `${user.email} has been deleted succesfully`
          }))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => {
        return res.status(400).send({
          message: 'There was a problem with the userId check if it is a number',
          Error : UserController.HandleErr(error)
        });
      });
  }

  /**
   * SearchUsers
   *
   * find users by their username
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res list of users matching the search
   */
  static SearchUsers(req, res) {
    return User
      .findAll({
        where: {
          $or: [{
            userName: {
              $ilike: '%' + req.query.q + '%'
            }
          }]
        },
        order: '"createdAt" DESC'
      })
      .then((users) => {
        if (users.length < 1) {
          return res.status(404).send({
            message: "No users match that search criteria"
          });
        }
        return res.status(200).send(users.map(UserData));
      })
      .catch(error => res.status(400).send(error));
  }

  /**
   * Login
   *
   * logs in a user
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res list of the user details including the token generated
   */
  static Login(req, res) {
    return User
      .findOne({
        where: {
          email: req.body.email
        }
      })
      .then((user) => {
        if (user && user.Authenticate(req.body.password)) {
          const token = UserController.GenerateToken(user);
          return res.status(201).send({
            message: 'User Login Succesfull', token, user: UserData(user)});
        } else if (!user) {
          return res.status(401).send({
            message: 'Email does not Exist',
          });
        } else {
          return res.status(401).send({
            message: 'Wrong Password',
          });
        }
      })
      .catch(error => {
        return res.status(400).send({
          message: 'There was a problem login in',
          Error : UserController.HandleErr(error)
        });
      });
  }

  /**
   * Logout
   *
   * logs out a user
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res success message
   */
  static Logout(req, res) {
    req.deoded = null;
    return res.status(200).send({
      message: 'user successfully logged out',
    });
  }

  /**
   * VerifyOwner
   *
   * verifies user making a request
   *
   * @param {object} req The request object
   * @param {object} user user being verified
   * @returns {boolean} true | false
   */
  static VerifyOwner(req, user) {
    if (!user){
      return true;
    } else {
      if(user.id === req.decoded.id){
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * HandleErr
   *
   * returns a readable error message
   *
   * @param {object} error The request object
   * @returns {object | string } error message
   */
  static HandleErr(error) {
    if (typeof error === 'object'){
      if(!error.errors){
        return error.message;
      } else {
        return error.errors[0].message;
      }
    } else {
      return error;
    }
  }
}

module.exports = UserController;
