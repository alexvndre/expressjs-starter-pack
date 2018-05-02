import express from 'express';
import mongodb from 'mongodb';
import resourceRepository from './../../repository/resource';
import validator from './../../validator/resource';

const router = express.Router();

const setOptions = httpParams => ({
  limit: httpParams.limit ? parseInt(httpParams.limit, 10) : 20,
  skip: httpParams.offset ? parseInt(httpParams.offset, 10) : 0,
  sort: { _id: -1 },
});

/**
 * ALL /v1/resources
 */
router.route('/')
  // GET /v1/resources
  .get((req, res) => {
    resourceRepository.findBy({}, setOptions(req.query))
      .then((docs) => {
        res.status(200).json(docs);
      });
  })
  // POST /v1/resources
  .post(validator.checkBody, (req, res) => {
    resourceRepository
      .insertOne(req.body)
      .then((doc) => {
        res.status(201).json(doc);
      });
  });

router.route('/:id')
  // GET /v1/resources/:id
  .get((req, res) => {
    resourceRepository
      .findOneBy({ _id: mongodb.ObjectID(req.params.id) })
      .then((doc) => {
        if (doc === null) {
          res.status(404).json({ code: 404, message: 'Resource not found' });
        } else {
          res.status(200).json(doc);
        }
      });
  })
  // PUT /v1/resources/:id
  .put(validator.checkBody, (req, res) => {
    resourceRepository
      .updateOne({ _id: mongodb.ObjectID(req.params.id) }, req.body)
      .then((doc) => {
        if (doc === null) {
          res.status(201).json();
        } else {
          res.status(200).json(doc);
        }
      });
  })
  // DELETE /v1/resources/:id
  .delete((req, res) => {
    resourceRepository
      .deleteOne({ _id: mongodb.ObjectID(req.params.id) })
      .then(res.status(204).json());
  });

export default router;
