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

        state.db = db;

        resolve();
      }
    });
  }
});

exports.get = () => state.db;

exports.getDb = () => state.db.db(config.get('mongo').database);

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
  if (state.db && state.db.db(config.get('mongo').database)) {
    if (state.db.db(config.get('mongo').database).collections) {
      state.db.db(config.get('mongo').database).collections((err, collections) => {
        if (err) {
          reject(err);
        } else {
          const p = [];

          for (let i = 0; i < collections.length; i += 1) {
            const r = collections[i]
              .deleteMany((errDelete, res) => {
                if (errDelete) {
                  return reject(errDelete);
                }

                return resolve(res);
              });

            p.push(r);
          }

          Promise.all(p)
            .then(() => {
              resolve(null);
            });
        }
      });
    } else {
      resolve(null);
    }
  } else {
    reject(new Error('Missing database connection'));
  }
});

exports.fixture = (name, data) => new Promise((resolve, reject) => {
  if (state.db && state.db.db(config.get('mongo').database)) {
    state.db.db(config.get('mongo').database).createCollection(name, (err, collection) => {
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
