const db = require('../models');

const Role = db.Role;

/**
 * RoleController
 *
 * Creates the document controller
 * @class
 */
class RoleController {
  /**
   * CreateRole
   *
   * create a role
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} role object created
   */
  static CreateRole(req, res) {
    return Role
      .create({
        title: req.body.title
      })
      .then(role => res.status(201).send(role))
      .catch(error => res.status(400).send(error));
  }

  /**
   * GetRoles
   *
   * Gets existing roles
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} list of roles found
   */
  static GetRoles(req, res) {
    return Role
      .all()
      .then(roles => res.status(200).send(roles))
      .catch(error => res.status(400).send(error));
  }

  /**
   * UpdateRole
   *
   * Updates a role
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} role object updated
   */
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

  /**
   * DeleteRole
   *
   * Deletes a role
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} success message
   */
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
