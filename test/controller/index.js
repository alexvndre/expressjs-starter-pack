import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './../../src/app';

const should = chai.should();

chai.use(chaiHttp);

describe('controller/index', () => {
  it('it should thrown 404', (done) => {
    chai
      .request(server)
      .get('/not-found-route')
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('code');
        res.body.code.should.eql(404);
        res.body.should.have.property('message');
        res.body.message.should.eql('Not found');
        done();
      });
  });
});
