import db from '../models';
import jwt from 'jsonwebtoken';
import config from '../../config/config';

const secret = config.secret;
const User = db.User;
const Document = db.document;

class UserController {
  static UserInfo(user) {
    return {
      roleId: user.roleId,
      email: user.email,
      id: user.id
    }
  }
  static GenerateToken(user) {
    return jwt.sign(UserController.UserInfo(user), secret, {
      expiresIn: '24h'
    });
  }
  static CreateUser(req, res) {
    return User
      .create(req.body)
      .then((user) => {
        const token = UserController.GenerateToken(user)
        return res.status(201).send({
          message: 'User created Succesfully',
          token: token,
          user: user
        })
      })
      .catch(error => res.status(400).send(error)); // res.status(400).send(error)
  }
  static ListUsers(req, res) {
    return User
      .all()
      .then(user => res.status(200).send(user))
      .catch(error => res.status(400).send(error));
  }
  static RetrieveUser(req, res) {
    return User
      .findById(req.params.UserId, {
        include: [{
          model: Document,
          as: 'documents'
        }],
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'user Not Found',
          });
        }
        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));
  }
  static UpdateUser(req, res) {
    return User
      .findById(req.params.UserId, {
        include: [{
          model: Document,
          as: 'documents',
        }],
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'user Not Found',
          });
        }
        return user
          .update(req.body, {
            fields: Object.keys(req.body)
          })
          .then(() => res.status(200).send(user)) // Send back the updated todo.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  }
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
      .catch(error => res.status(400).send(error));
  }
  static Login(req, res) {
    return User
      .findOne({
        where: {
          email: req.body.email
        }
      })
      .then((user) => {
        if (user && user.Authenticate(req.body.password)) {
          const token = UserController.GenerateToken(user)
          return res.status(201).send({
            message: 'User Login Succesfull',
            token: token,
            user: user
          })
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
      .catch(error => res.status(400).send(error));
  }
  static Logout(req, res) {
    console.log('a');
  }
}

export default UserController;
