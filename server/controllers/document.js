import db from '../models'
const document = db.document;

class DocController {
  static CreateDoc(req, res) {
    return document
      .create({
        title: req.body.title,
        content: req.body.content,
        userId: req.body.userId,
        access: req.body.access
      })
      .then(Role => res.status(201).send(Role))
      .catch(error => res.status(400).send(error));
  }
  static ListDocs(req, res) {
    return document
      .findAll({
        where: {
          access: 'public'
        }
      })
      .then(documents => res.status(200).send(documents))
      .catch(error => res.status(400).send(error));
  }
  static GetDocs(req, res) {
    return document
      .findById(req.params.DocId)
      .then(document => {
        if (!document) {
          return res.status(404).send({
            message: 'Document not found',
          });
        }
        return res.status(200).send(document);
      })
      .catch(error => res.status(400).send(error));
  }
  static UpdateDoc(req, res) {
    return document
      .findById(req.params.DocId)
      .then(document => {
        if (!document) {
          return res.status(404).send({
            message: 'Document not found',
          });
        }
        return document
          .update(req.body, {
            fields: Object.keys(req.body)
          })
          .then(() => res.status(200).send(document)) // Send back the updated todo.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  }
  static DeleteDoc(req, res) {
    return document
      .findById(req.params.DocId)
      .then(document => {
        if (!document) {
          return res.status(400).send({
            message: 'Document not found',
          });
        }
        return document
          .destroy()
          .then(() => res.status(200).send({
            message: `${document.title} has been deleted succesfully`
          }))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  }
  static RetrieveDocsByUser(req, res) {
    return document
      .findAll({
        where: {
          userId: req.params.UserId
        }
      })
      .then(document => {
        if (!document) {
          return res.status(404).send({
            message: 'No Documents found',
          });
        }
        return res.status(200).send(document);
      })
      .catch(error => res.status(400).send(error));
  }
}

export default DocController;
