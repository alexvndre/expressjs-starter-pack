import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './../src/server';

chai.should();

chai.use(chaiHttp);

describe('app', () => {
  it('it should thrown 500', (done) => {
    chai
      .request(server)
      .post('/v1/resource')
      .set('Content-Type', 'application/json')
      .send('toto')
      .end((err, res) => {
        res.status.should.eql(500);
        res.body.should.have.property('code');
        res.body.code.should.eql(500);
        res.body.should.have.property('message');
        done();
      });
  });
});
