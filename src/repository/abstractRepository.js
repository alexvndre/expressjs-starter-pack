/* eslint no-underscore-dangle: [
    "error", { "allow": ["_collectionName", "_defaultOptions", "_getCollection"] }
   ] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["insertOne"] }] */

import db from './../helper/database';

class AbstractRepository {
  constructor(collectionName) {
    this._collectionName = collectionName;
    this._defaultOptions = {
      limit: 1,
      skip: 0,
      sort: { _id: -1 },
    };

    if (new.target === AbstractRepository) {
      throw new TypeError('Cannot construct an abstract instance directly');
    }
  }

  _getCollection() {
    return new Promise((resolve, reject) => {
      db.getDb().collection(this._collectionName, (err, collection) => {
        if (err) {
          return reject(err);
        }

        return resolve(collection);
      });
    });
  }

  insertOne(doc) {
    return new Promise((resolve, reject) => {
      this._getCollection()
        .then((collection) => {
          collection
            .insertOne(doc, (err, res) => {
              if (err) {
                return reject(err);
              }

              return resolve(res.ops[0]);
            });
        });
    });
  }

  findBy(query = {}, options = this._defaultOptions) {
    return new Promise((resolve, reject) => {
      this._getCollection()
        .then((collection) => {
          collection
            .find(query)
            .skip(options.skip)
            .limit(options.limit)
            .sort(options.sort)
            .toArray((errCollection, res) => {
              if (errCollection) {
                return reject(errCollection);
              }

              return resolve(res);
            });
        });
    });
  }

  findOneBy(query = {}, options = this._defaultOptions) {
    return new Promise((resolve, reject) => {
      this._getCollection()
        .then((collection) => {
          collection
            .findOne(query, options, (err, res) => {
              if (err) {
                return reject(err);
              }

              return resolve(res);
            });
        });
    });
  }

  updateOne(filter = {}, update = {}) {
    return new Promise((resolve, reject) => {
      const opts = { sort: { _id: -1 }, upsert: true };

      this._getCollection()
        .then((collection) => {
          collection
            .findOneAndUpdate(filter, update, opts, (err, res) => {
              if (err) {
                return reject(err);
              }

              return resolve(res.value);
            });
        });
    });
  }

  deleteOne(filter = {}) {
    return new Promise((resolve, reject) => {
      const opts = { sort: { _id: -1 } };

      this._getCollection()
        .then((collection) => {
          collection
            .findOneAndDelete(filter, opts, (err, res) => {
              if (err) {
                return reject(err);
              }

              return resolve(res.value);
            });
        });
    });
  }

  count(query = {}) {
    return new Promise((resolve, reject) => {
      this._getCollection()
        .then((collection) => {
          collection
            .count(query, {}, (err, res) => {
              if (err) {
                return reject(err);
              }

              return resolve(res);
            });
        });
    });
  }
}

export default AbstractRepository;
