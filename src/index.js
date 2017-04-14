/* eslint global-require: "off" */
/**
 * Credits to https://github.com/rowanmanning/learning-express-cluster
 */

// Include the cluster module
import cluster from 'cluster';
import os from 'os';
import logger from './helper/logger';

// Code to run if we're in the master process
if (cluster.isMaster) {
  // Count the machine's CPUs
  const cpuCount = os.cpus().length;

  // Create a worker for each CPU
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', (worker) => {
    // Replace the dead worker, we're not sentimental
    logger.info(`Worker ${worker.id} died :(`);
    cluster.fork();
  });
} else { // Code to run if we're in a worker process
  require('./app');
  logger.info(`Worker ${cluster.worker.id} running!`);
}
