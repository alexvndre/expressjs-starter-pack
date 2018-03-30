/* eslint no-underscore-dangle: ["error", { "allow": ["_collectionName", "_defaultOptions"] }] */
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

  insertOne(doc) {
    return new Promise((resolve, reject) => {
      db.get().collection(this._collectionName).insertOne(doc, (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res.ops[0]);
      });
    });
  }

  findBy(query = {}, options = this._defaultOptions) {
    return new Promise((resolve, reject) => {
      db.get().collection(this._collectionName)
        .find(query, options)
        .skip(options.skip)
        .limit(options.limit)
        .sort(options.sort)
        .toArray((err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res);
        });
    });
  }

  findOneBy(query = {}, options = this._defaultOptions) {
    return new Promise((resolve, reject) => {
      db.get().collection(this._collectionName).findOne(query, options, (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res);
      });
    });
  }

  updateOne(filter = {}, update = {}) {
    return new Promise((resolve, reject) => {
      const opts = { sort: { _id: -1 }, upsert: true };

      db.get().collection(this._collectionName)
        .findOneAndUpdate(filter, update, opts, (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.value);
        });
    });
  }

  deleteOne(filter = {}) {
    return new Promise((resolve, reject) => {
      const opts = { sort: { _id: -1 } };

      db.get().collection(this._collectionName)
        .findOneAndDelete(filter, opts, (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.value);
        });
    });
  }

  count(query = {}) {
    return new Promise((resolve, reject) => {
      db.get().collection(this._collectionName)
        .count(query, {}, (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res);
        });
    });
  }
}

export default AbstractRepository;
