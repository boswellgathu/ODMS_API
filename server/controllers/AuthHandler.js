const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../../config/config');

const User = db.User;
const secret = config.secret;

/**
 * AuthHandler
 *
 * Handles Authentication
 * @class
 */
class AuthHandler {
  /**
   * VerifyToken
   *
   * Verifies a token
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @param {function} next The callback function
   * @returns {object} res The response object
   */
  static VerifyToken(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(403).send({
            message: 'Failed to authenticate token.'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
        message: "No token provided."
      });
    }
  }

  /**
   * VerifyAdmin
   *
   * Verifies a user is an admin
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @param {function} next The callback function
   * @returns {object} res The response object
   */
  static VerifyAdmin(req, res, next) {
    const Role = req.decoded.roleId;
    if (Role && Role === 1) {
      next();
    } else {
      return res.status(403).send({
        message: "You do not have permission to access this"
      });
    }
  }

  /**
   * VerifyUser
   *
   * Verifies a user is an ordinary user
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @param {function} next The callback function
   * @returns {object} res The response object
   */
  static VerifyUser(req, res, next) {
    const Role = req.decoded.roleId;
    if (Role && (Role === 1 || Role === 2)) {
      next();
    } else {
      return res.status(403).send({
        message: "You do not have permission to access this"
      });
    }
  }

  /**
   * UserData
   *
   * returns user's Data
   *
   * @param {object} user The user object
   * @returns {object} user object
   */
  static UserData(user) {
      const {id, userName, email, firstName, lastName, createdAt, updatedAt} = user;
      return {id, userName, email, firstName, lastName, createdAt, updatedAt};
  }
}
module.exports = AuthHandler;
