const document = require('../models').document;

module.exports = {
  create(req, res) {
    return document
      .create({
        title: req.body.title,
        content: req.body.content,
        userId: req.body.userId
      })
      .then(Role => res.status(201).send(Role))
      .catch(error => res.status(400).send(error));
  }
}
