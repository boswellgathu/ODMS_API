const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../../config/config');

const User = db.User;
const secret = config.secret;

class AuthHandler {
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
  static VerifyAdmin(req, res, next) {
    const Role = req.decoded.roleId;
    if (Role && Role === 1) {
      // TODO set the role to a name
      next();
    } else {
      return res.status(403).send({
        message: "You do not have permission to access this"
      })
    }
  }
  static VerifyUser(req, res, next) {
    const Role = req.decoded.roleId;
    if (Role && (Role === 1 || Role === 2)) {
      next();
    } else {
      return res.status(403).send({
        message: "You do not have permission to access this"
      })
    }
  }
}
module.exports = AuthHandler;
