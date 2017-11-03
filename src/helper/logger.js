/* eslint no-underscore-dangle: ["error", { "allow": ["_logger"] }] */

import winston from 'winston';
import config from './../config/index';

class Logger {
  constructor() {
    this._logger = new winston.Logger({
      level: 'error',
      transports: [
        new winston.transports.File({ filename: './var/log/error.log' }),
      ],
    });

    if (config.app.environment === 'local') {
      this._logger.add(winston.transports.Console, {
        level: 'info',
        timestamp: () => (new Date().toISOString()),
        formatter: options => (`${options.timestamp()} ${winston.config.colorize(options.level, options.level.toUpperCase())} ${(options.message ? options.message : '')} ${(options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : '')}`),
      });
    }
  }

  info(message, meta) {
    if (config.app.environment === 'local') {
      this._logger.log('info', message, meta);
    }
  }

  error(message, meta) {
    if (config.app.environment === 'local') {
      this._logger.log('error', message, meta);
    }
  }
}

export default new Logger();
