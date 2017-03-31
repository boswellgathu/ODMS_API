const db = require('../models');
const Document = db.Document;

class DocController {
  static CreateDoc(req, res) {
    return Document
      .create(req.body)
      .then(documents => res.status(201).send({
        message: "Document created succesfully",
        document: documents
      }))
      .catch(error => res.status(400).send(error));
  }

  static ListDocs(req, res) {
    if (req.query.limit || req.query.offset)
      return Document
        .findAll({
          where: {
            access: 'public',
          },
          limit: req.query.limit,
          offset: req.query.offset
        })
        .then((documents) => {
          if (documents.length < 1)
            return res.status(200).send({
              message: 'No documents exist currently'
            })
          return res.status(200).send(documents);
        })
        .catch(error => res.status(400).send(error));

    return Document
      .findAll({
        where: {
          access: 'public'
        }
      })
    .then(documents => res.status(200).send(documents))
    .catch(error => res.status(400).send(error));
  }

  static GetDoc(req, res) {
    return Document
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
    return Document
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
    return Document
      .findById(req.params.DocId)
      .then(document => {
        if (!document) {
          return res.status(404).send({
            message: 'Document not found',
          });
        }
        return document
          .destroy()
          .then(() => res.status(200).send({
            message: `${document.title} has been deleted succesfully`
          }))
          .catch(error => res.status(404).send(error));
      })
      .catch(error => res.status(400).send(error));
  }

  static RetrieveDocsByUser(req, res) {
    return Document
      .findAll({
        where: {
          userId: req.params.UserId
        }
      })
      .then(documents => {
        if (documents.length === 0) {
          return res.status(404).send({
            message: 'No Documents found',
          });
        }
        return res.status(200).send(documents);
      })
      .catch(error => res.status(400).send(error));
  }

  static SearchDocs(req, res) {
    return Document
      .findAll({
        where: {
          $or: [{
            title: {
              $ilike: '%' + req.query.doctitle + '%'
            }
          }]
        }
      })
      .then((documents) => {
        if (documents.length < 1) {
          return res.status(400).send({
            message: "No documents match that search criteria"
          })
        }
        return res.status(200).send(documents);
      })
      .catch(error => res.status(400).send(error));
  }
}

module.exports =  DocController;
