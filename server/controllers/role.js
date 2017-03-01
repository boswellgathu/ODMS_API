const role = require('../models').role;

module.exports = {
  create(req, res) {
    return role
      .create({
        title: req.body.title,
      })
      .then(Role => res.status(201).send(Role))
      .catch(error => res.status(400).send(error));
  }
}
