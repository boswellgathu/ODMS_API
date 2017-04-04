const db = require('../models');
const HandleErr = require('./UserController').HandleErr;
const Document = db.Document;

/**
 * DocController
 *
 * Creates the document controller
 * @class
 */
class DocController {
  /**
   * createDoc
   *
   * Creates a new document
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res The document created
   */
  static CreateDoc(req, res) {
    return Document
      .create(req.body)
      .then(documents => res.status(201).send({
        message: "Document created succesfully",
        document: documents
      }))
      .catch(error => {
        return res.status(400).send({
          message: 'There was a problem creating the document',
          Error : HandleErr(error)
        });
      });
  }

  /**
   * ListDoc
   *
   * Creates a new document
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res The list of documents found
   */
  static ListDocs(req, res) {
    if (req.query.limit || req.query.offset) {
      return Document
        .findAll({
          where: {
            access: 'public',
          },
          limit: req.query.limit,
          offset: req.query.offset
        })
        .then((documents) => {
          if (documents.length < 1) {
            return res.status(404).send({
              message: 'No documents exist currently'
            });
          }
            return res.status(200).send(documents);
        })
        .catch(error => {
          return res.status(400).send({
            message: 'There was a problem with the query params check if they are all numbers',
            Error : HandleErr(error)
          });
        });
    }

    return Document
      .findAll({
        where: {
          access: 'public'
        }
      })
    .then(documents => res.status(200).send(documents))
    .catch(error => res.status(400).send(error));
  }

  /**
   * GetDoc
   *
   * gets a specified document
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res The document got
   */
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
      .catch(error => {
        return res.status(400).send({
          message: 'There was a problem with the DocId, check if it is a number',
          Error : HandleErr(error)
        });
      });
  }

  /**
   * UpdateDoc
   *
   * Updates an existing document
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res The updated document
   */
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
          .then(() => res.status(200).send(document))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => {
        return res.status(400).send({
          message: 'There was a problem with the DocId, check if it is a number',
          Error : HandleErr(error)
        });
      });
  }

  /**
   * DeleteDoc
   *
   * Creates a new document
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res success message
   */
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
      .catch(error => {
        return res.status(400).send({
          message: 'There was a problem with the DocId, check if it is a number',
          Error : HandleErr(error)
        });
      });
  }

  /**
   * RetrieveDocsByUser
   *
   * Gets all documents by a certain user
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res list of all documents found
   */
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
            message: 'No Documents found for that user',
          });
        }
        return res.status(200).send(documents);
      })
      .catch(error => {
        return res.status(400).send({
          message: 'There was a problem with the UserId, check if it is a number',
          Error : HandleErr(error)
        });
      });
  }

  /**
   * SearchDocs
   *
   * search for docs matching the search criteria
   *
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} res list of all documents found
   */
  static SearchDocs(req, res) {
    return Document
      .findAll({
        where: {
          $or: [{
            title: {
              $ilike: '%' + req.query.q + '%'
            }
          }]
        }
      })
      .then((documents) => {
        if (documents.length < 1) {
          return res.status(404).send({
            message: "No documents match that search criteria"
          });
        }
        return res.status(200).send(documents.map(DocController.DocData));
      })
      .catch(error => res.status(400).send(error));
  }

  /**
   * DocData
   *
   * returns Doc's Data
   *
   * @param {object} doc The user object
   * @returns {object} doc object
   */
  static DocData(doc) {
    const {id, title, content } = doc;
    return {id, title, content };
  }
}

module.exports =  DocController;
