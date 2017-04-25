import express from 'express';
import resource from './resource';

const router = express.Router();

router.use('/resources', resource);

export default router;
