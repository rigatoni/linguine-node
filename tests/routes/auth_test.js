var request = require('supertest')
var chai = require('chai');
var expect = chai.expect;
var app = require('../../app');
var util = require('util');
var passportMock = require('../passport/passport-mock');

describe('Authentication', function(){
  describe('logged_in', function(){
    it('should not work when not logged in', function(done){
     request(app)
        .get('/api/logged_in')
        .expect(200)
        .end(function(err, res){
          expect(err).to.be.null;
          expect(res.body).to.have.property('loggedIn', false);
          done();
        });
    });

    it('should work when logged in', function(done){
      passportMock()
      var agent =request.agent(app);
      agent
        .post('/api/login')
        .send({username: 'abc123', password: 'abc123'})
        .end(function(res){
           agent
            .get('/api/logged_in')
            .expect(200)
            .end(function(err, res){
              expect(err).to.be.null;
              expect(res.body).to.have.property('loggedIn', true);
              done();
            });
        });
    });
  })
});
