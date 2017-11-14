import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from './../../src/server';

chai.should();

chai.use(chaiHttp);

describe('controller/index', () => {
  it('it should thrown 404', (done) => {
    chai
      .request(server)
      .get('/not-found-route')
      .send()
      .end((err, res) => {
        res.status.should.eql(404);
        res.body.code.should.eql(404);
        res.body.message.should.eql('Not found');
        done();
      });
  });
});
