/* eslint no-console: "off" */
import config from './../config/index';

class Logger {
  static info(message) {
    if (config.app.environment === 'local') {
      console.log(message);
    }
  }
}

export default Logger;
