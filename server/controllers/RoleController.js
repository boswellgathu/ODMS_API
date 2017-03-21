const db = require('../models');

const Role = db.Role;

class RoleController {
  static CreateRole(req, res) {
    return Role
      .create({
        title: req.body.title,
      })
      .then(Role => res.status(201).send(Role))
      .catch(error => res.status(400).send(error));
  }
  static GetRoles(req, res) {
    return Role
      .all()
      .then(roles => res.status(200).send(roles))
      .catch(error => res.status(400).send(error));
  }
}

module.exports = RoleController;
