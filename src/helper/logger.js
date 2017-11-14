/* eslint no-underscore-dangle: ["error", { "allow": ["_logger"] }] */

import winston from 'winston';

class Logger {
  constructor() {
    this._logger = new winston.Logger({
      level: 'error',
      transports: [
        new winston.transports.File({ filename: './var/log/error.log' }),
      ],
    });

    if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test') {
      this._logger.add(winston.transports.Console, {
        level: 'info',
        timestamp: () => (new Date().toISOString()),
        formatter: options => (`[${winston.config.colorize(options.level, options.level.toUpperCase())}][${options.timestamp()}] ${(options.message ? options.message : '')} ${(options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : '')}`),
      });
    }
  }

  info(message, meta) {
    if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test') {
      this._logger.log('info', message, meta);
    }
  }

  error(message, meta) {
    if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test') {
      this._logger.log('error', message, meta);
    }
  }
}

export default new Logger();
