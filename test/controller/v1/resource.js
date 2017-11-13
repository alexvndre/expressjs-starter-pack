import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './../../../src/server';

const should = chai.should();

chai.use(chaiHttp);

describe('controller/v1/resource', () => {
  it('it should return a list of objects', (done) => {
    chai
      .request(server)
      .get('/v1/resources')
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.forEach((item) => {
          item.should.be.a('object');
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
        res.should.have.status(400);
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
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.id.should.eql(1);
        done();
      });
  });

  it('it should return an object', (done) => {
    chai
      .request(server)
      .get('/v1/resources/1')
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.id.should.eql('1');
        done();
      });
  });

  it('it should edit an object', (done) => {
    chai
      .request(server)
      .put('/v1/resources/1')
      .send({ name: 'test' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.id.should.eql('1');
        done();
      });
  });

  it('it should delete an object', (done) => {
    chai
      .request(server)
      .delete('/v1/resources/1')
      .send()
      .end((err, res) => {
        res.should.have.status(204);
        done();
      });
  });
});
