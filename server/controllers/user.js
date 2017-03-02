import db from '../models';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET || 'hahathisisnottruejwtisafakerdontuseityouarebeingf**dwith';
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
    return jwt.sign(UserInfo(user), secret, {
      expiresIn: 60 * 60 * 24 // 24 Hours
    });
  }
  static CreateUser(req, res) {
    return User
      .create(req.body)
      .then((user) => {
        const token = jwt.sign({
          roleId: user.roleId,
          email: user.email,
          id: user.id
        }, secret, {
          expiresIn: 60 * 60 * 24
        })
        return res.status(201).send({
          message: 'User created Succesfully',
          token: token,
          user: user
        })
      })
      .catch(error => console.log(error)); // res.status(400).send(error)
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
          return res.status(400).send({
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
}

export default UserController;
