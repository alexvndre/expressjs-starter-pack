import express from 'express';
import v1 from './v1/index';

const router = express.Router();

router.use('/v1', v1);
router.use('*', (req, res) => {
  res.status(404).json({
    code: 404,
    message: 'Not found',
  });
});

export default router;
