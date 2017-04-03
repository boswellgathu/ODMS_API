const db = require('../models');

const Role = db.Role;

class RoleController {
  static CreateRole(req, res) {
    return Role
      .create({
        title: req.body.title
      })
      .then(role => res.status(201).send(role))
      .catch(error => res.status(400).send(error));
  }

  static GetRoles(req, res) {
    return Role
      .all()
      .then(roles => res.status(200).send(roles))
      .catch(error => res.status(400).send(error));
  }

  static UpdateRole(req, res) {
    return Role
    .findById(req.params.roleId)
    .then(role => {
      if (!role){
        return res.status(404).send({
          message: "Role not Found"
        });
      }
      return role
      .update(req.body, {
            fields: Object.keys(req.body)
          })
          .then(() => res.status(200).send(role))
          .catch((error) => res.status(400).send(error));
    })
      .catch(error => res.status(400).send(error));
  }

  static DeleteRole(req, res) {
    return Role
      .findById(req.params.roleId)
      .then(role => {
        if (!role) {
          return res.status(404).send({
            message: 'role Not Found',
          });
        }
        return role
          .destroy()
          .then(() => res.status(200).send({
            message: `${role.id} has been deleted succesfully`
          }))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  }
}

module.exports = RoleController;
