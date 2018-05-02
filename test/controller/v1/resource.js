import { before, beforeEach, describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from './../../../src/helper/database';
import fixtures from '../../fixtures/resources.json';
import resourceRepository from './../../../src/repository/resource';
import server from './../../../src/server';

chai.should();

chai.use(chaiHttp);

describe('controller/v1/resource', () => {
  before((done) => {
    db.connect()
      .then(done());
  });

  beforeEach((done) => {
    db.drop()
      .then(() => {
        db.fixture('Resource', fixtures)
          .then(done());
      });
  });

  it('it should return a list of objects', (done) => {
    chai
      .request(server)
      .get('/v1/resources')
      .send()
      .end((err, res) => {
        res.status.should.eql(200);
        res.body.should.be.a('array');
        res.body.should.have.lengthOf(20);
        res.body.forEach((item) => {
          item.should.be.a('object');
          item.should.have.property('name');
        });

        done();
      });
  });

  it('it should throw an error because of an invalid body', (done) => {
    chai
      .request(server)
      .post('/v1/resources')
      .set('Content-Type', 'application/json')
      .send({ test: 'test' })
      .end((err, res) => {
        res.status.should.eql(400);
        res.body.should.be.a('array');
        res.body[0].should.have.property('code');
        res.body[0].should.have.property('message');
        res.body[0].code.should.eql(400);
        res.body[0].message.should.eql('The field name is required.');
        done();
      });
  });

  it('it should post a valid resource', (done) => {
    chai
      .request(server)
      .post('/v1/resources')
      .set('Content-Type', 'application/json')
      .send({ name: 'test' })
      .end((err, res) => {
        res.status.should.eql(201);
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body.should.have.property('name');

        resourceRepository.findOneBy({ name: 'test' })
          .then((doc) => {
            doc.name.should.be.equal('test');

            done();
          });
      });
  });

  it('it should return a resource', (done) => {
    resourceRepository.findOneBy({ name: 'resource 1' })
      .then((doc) => {
        chai
          .request(server)
          .get(`/v1/resources/${doc._id}`)
          .send()
          .end((err, res) => {
            res.status.should.eql(200);
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('name');
            res.body.name.should.be.equal('resource 1');

            done();
          });
      });
  });

  it('it should edit a resource', (done) => {
    resourceRepository.findOneBy({ name: 'resource 1' })
      .then((doc) => {
        chai
          .request(server)
          .put(`/v1/resources/${doc._id}`)
          .send({
            name: 'resource 1 updated',
          })
          .end((err, res) => {
            res.status.should.eql(200);

            resourceRepository.findOneBy({ name: 'resource 1 updated' })
              .then((docUpdated) => {
                docUpdated._id.should.eql(doc._id);
                done();
              });
          });
      });
  });

  it('it should delete an object', (done) => {
    resourceRepository.findOneBy({ name: 'resource 1' })
      .then((doc) => {
        chai
          .request(server)
          .delete(`/v1/resources/${doc._id}`)
          .send()
          .end((err, res) => {
            res.status.should.eql(204);

            resourceRepository.findOneBy({ name: 'resource 1' })
              .then((docDeleted) => {
                if (docDeleted === null) {
                  done();
                }
              });
          });
      });
  });
});
