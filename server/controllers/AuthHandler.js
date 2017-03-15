import jwt from 'jsonwebtoken';
import db from '../models';
import config from '../../config/config';

const User = db.User;
const secret = config.secret;

class AuthHandler {
  static UserInfo(user) {
    return {
      role: user.roleId,
      email: user.email,
      userId: user.id
    }
  }
  static GenerateToken(user) {
    return jwt.sign(UserInfo(user), secret, {
      expiresIn: 60 * 60 * 24 // 24 Hours
    });
  }
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
        message: 'No token provided.'
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
export default AuthHandler;
