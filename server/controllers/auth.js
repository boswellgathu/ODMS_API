const jwt = require('jsonwebtoken');
const User = require('../models').User;

module.exports = {
  UserInfo(user) {
    return {
      user.roleId,
      user.email,
      user.id
    }
  },
  GenerateToken(user) {
    return jwt.sign(UserInfo(user), secret, {
      expiresIn: 60 * 60 * 24 // 24 Hours
    });
  },
  CheckToken(req, res) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.json({
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
        }
      });
    } else {
      // if there is no token return an error
      return res.status(403).send({
        message: 'No token provided.'
      });
    }
  },
  Login(user) {
    // login method
  },
  Logout(user) {
    // logout method
  }
}
