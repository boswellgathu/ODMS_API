import db from '../models';

const role = db.role;

export default class RoleController {
  static CreateRole(req, res) {
    return role
      .create({
        title: req.body.title,
      })
      .then(Role => res.status(201).send(Role))
      .catch(error => res.status(400).send(error));
  }
  static GetRoles(req, res) {
    return role
      .all()
      .then(roles => res.status(200).send(roles))
      .catch(error => res.status(400).send(error));
  }
}
