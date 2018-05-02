import config from 'config';
import mongodb from 'mongodb';
import logger from './logger';

const state = {
  db: null,
};

exports.connect = () => new Promise((resolve, reject) => {
  if (state.db) {
    logger.info('Connection already opened');

    resolve();
  } else {
    const mongoConf = config.get('mongo');
    let uri = `mongodb://${mongoConf.host}:${mongoConf.port}`;

    if (mongoConf.user) {
      uri = `mongodb://${mongoConf.user}:${mongoConf.password}@${mongoConf.host}:${mongoConf.port}`;
    }

    uri = `${uri}/${mongoConf.database}`;

    mongodb.MongoClient.connect(uri, (err, db) => {
      if (err) {
        logger.error(`Connection failed: ${err.message}`);

        reject(err);
      } else {
        logger.info('Connected to the database');

        state.db = db.db(mongoConf.database);

        resolve();
      }
    });
  }
});

exports.get = () => state.db;

exports.close = () => new Promise((resolve, reject) => {
  if (state.db) {
    state.db.close()
      .then(() => {
        state.db = null;

        logger.info('Closed the connection with the database');

        resolve(null);
      })
      .catch((err) => {
        logger.error(`Closing failed: ${err.message}`);

        reject(err);
      });
  } else {
    logger.info('Connection already closed');

    resolve(null);
  }
});

exports.drop = () => new Promise((resolve, reject) => {
  if (state.db) {
    if (state.db.collections) {
      state.db.collections((err, collections) => {
        if (err) {
          reject(err);
        } else {
          for (let i = 0; i < collections.length; i += 1) {
            collections[i].removeMany();
          }
        }
      });
    }

    resolve(null);
  } else {
    reject(new Error('Missing database connection'));
  }
});

exports.fixture = (name, data) => new Promise((resolve, reject) => {
  if (state.db) {
    state.db.createCollection(name, (err, collection) => {
      if (err) {
        reject(err);
      } else {
        collection.insert(data, (errInsert) => {
          if (errInsert) {
            reject(errInsert);
          } else {
            resolve(null);
          }
        });
      }
    });
  } else {
    reject(new Error('Missing database connection'));
  }
});
