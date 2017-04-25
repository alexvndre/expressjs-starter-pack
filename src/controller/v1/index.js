import express from 'express';
import hello from './hello';
import resource from './resource';

const router = express.Router();

router.use('/hello', hello);
router.use('/resources', resource);

export default router;
