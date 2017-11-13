/* eslint no-unused-vars: ["error", { "args": "none" }] */

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import expressValidator from 'express-validator';
import controllers from './controller/index';
import logger from './helper/logger';

const app = express();

app.use(bodyParser.json());
// To support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Body validator
app.use(expressValidator({
  errorFormatter: (param, msg) => ({
    code: 400,
    message: msg,
  }),
}));
// Allow cross domain requests
app.use(cors());
app.use(controllers);
// Error middleware
app.use((err, req, res, next) => {
  logger.error(err.message, err);

  res.status(500).send({
    code: 500,
    message: err.stack,
  });
});

export default app;
