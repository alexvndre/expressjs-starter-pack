import express from 'express';

const router = express.Router();

/**
 * GET /v1/hello
 */
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello world!' });
});

export default router;
