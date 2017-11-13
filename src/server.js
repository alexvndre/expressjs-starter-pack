import http from 'http';
import normalizePort from 'normalize-port';
import app from './app';
import logger from './helper/logger';

const port = normalizePort(process.env.PORT || '3000');

/**
 * Create HTTP server.
 */
const server = http.createServer(app).listen(port, () => {
  logger.info(`Listening on port ${server.address().port}`);
});

export default server;
