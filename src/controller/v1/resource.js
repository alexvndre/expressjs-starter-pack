import express from 'express';
import validator from './../../validator/resource';

const router = express.Router();

/**
 * ALL /v1/resources
 */
router.route('/')
  // GET /v1/resources
  .get((req, res) => {
    res.status(200).json([
      {
        id: 1,
        name: 'Test 1',
      },
      {
        id: 2,
        name: 'Test 2',
      },
    ]);
  })
  // POST /v1/resources
  .post(validator.checkBody, (req, res) => {
    res.status(201).json({
      id: 1,
      name: req.body.name,
    });
  });

router.route('/:id')
  // GET /v1/resources/:id
  .get((req, res) => {
    res.status(200).json({
      id: req.params.id,
      name: 'Test',
    });
  })
  // PUT /v1/resources/:id
  .put(validator.checkBody, (req, res) => {
    res.status(200).json({
      id: req.params.id,
      name: req.body.name,
    });
  })
  // DELETE /v1/resources/:id
  .delete((req, res) => {
    res.status(204).json();
  });

export default router;
