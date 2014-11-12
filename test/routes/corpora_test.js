var request = require('supertest')
var chai = require('chai');
var expect = chai.expect;
var app = require('../../app');
var passportMock = require('../passport/passport-mock');
var Corpus = require('../../models/corpus');
var User = require('../../models/user');


describe('Corpora Routes', function(){
  var agent = request.agent(app)
  var user = null;
  var corpus = null;

  function login(done){
    agent
      .post('/api/login')
      .send({username: 'abc123', password: 'abc123'})
      .end(function(err, res){
        user = res.body;
        done();
      });
  }

  function logout(done){
    agent
      .post('/api/logout')
      .end(done);
  }

  function createCorpus(done) {
    User.findOne({dce: 'abc123'}, function(err, user){
      Corpus.create({ user_id: user._id,
                    fileName: 'something.txt',
                    fileSize: 100,
                    fileType: 'text',
                    title: 'Something',
                    contents: 'some content',
                    tags: ['here', 'are', 'some', 'tags']
                  }, function(err, c){
                    corpus = c;
                    done();
                  });
    });
  }
  before(function(){
    passportMock();
  });

  describe('GET /api/corpora', function(){

    describe('logged in', function(){

      beforeEach(function(done){
        login(done);
      });

      before(function(done){
        createCorpus(done);
      });

      it('should allow you get the corpora for the user', function(done){
        agent
          .get('/api/corpora')
          .expect(200)
          .end(function(err, res){
            expect(err).to.be.null;
            expect(res.body).to.have.length(1);
            done()
          });
      });

      after(function(done){
        Corpus.remove({}, done);
      });

      afterEach(function(done){
        logout(done);
      });
    });

    describe('not logged in', function(){
      it('should not allow you to get the corpora', function(done){
        agent
          .get('/api/corpora')
          .expect(401)
          .end(done);
      });
    });
  });

  describe('POST /api/corpora', function(){

    describe('logged in', function(){
      beforeEach(function(done){
        login(done);
      });

      it('should allow you to create a corpora', function(done){
        agent
          .post('/api/corpora')
          .send({ fileName: 'something.txt',
                  fileSize: 100,
                  fileType: 'text',
                  title: 'Something',
                  contents: 'some content'})
          .expect(201)
          .end(function(err, res){
            expect(res.body).to.have.property('fileName', 'something.txt');
            expect(res.body).to.have.property('fileSize', 100);
            expect(res.body).to.have.property('fileType', 'text');
            expect(res.body).to.have.property('title', 'Something');
            expect(res.body).to.have.property('contents', 'some content');
            expect(res.body).to.have.property('user_id', user._id);
            done();
          });
      });

      afterEach(function(done){
        logout(done);
      });
    });

    describe('not logged in', function(){
      it('should not allow you to create a corpora', function(done){
        agent
          .post('/api/corpora')
          .send({ fileName: 'something.txt',
                  fileSize: 100,
                  fileType: 'text',
                  title: 'Something',
                  contents: 'some content'})
          .expect(401)
          .end(done);
      });
    });
  });

  describe('GET /api/corpora/:id', function(){

    describe('logged in', function(){
      beforeEach(function(done){
        login(done);
      });

      before(function(done){
        createCorpus(done);
      })

      it('should allow you to get a corpora', function(done){
        agent
          .get('/api/corpora/' + corpus._id)
          .expect(200)
          .end(done);
      });

      after(function(done){
        Corpus.remove({}, done);
      });

      afterEach(function(done){
        logout(done);
      });
    });

    describe('not logged in', function(){
      it('should allow you to get a corpora', function(done){
        agent
          .get('/api/corpora/' + corpus._id)
          .expect(401)
          .end(done);
      });

    });
  });

  describe('DELETE /api/corpora/:id', function(){

    describe('logged in', function(){
      beforeEach(function(done){
        login(done);
      });

      before(function(done){
        createCorpus(done);
      });

      it('should allow you to delete a corpus', function(done){
        agent
          .delete('/api/corpora/' + corpus._id)
          .expect(204)
          .end(function(err, res){
            Corpus.find({}, function(err, corpora){
              expect(corpora).to.have.length(0);
              done();
            });
          });
      });

      after(function(done){
        Corpus.remove({}, done);
      });

      afterEach(function(done){
        logout(done);
      });
    });

    describe('not logged in', function(){
      it('should not allow you to delete a corpus', function(done){
        agent
          .delete('/api/corpora/' + corpus._id)
          .expect(401)
          .end(done);
      });
    });
  });
});
