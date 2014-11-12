var chai = require('chai');
var expect = chai.expect;
var Corpus = require('../../models/corpus');
var User = require('../../models/user');

describe('Corpus', function(){
  var user = new User({name: 'John Doe', dce: 'jcd1234'});
  var corpus;

  before(function(done){
    user.save(done);
  });

  beforeEach(function(done){
    corpus = new Corpus({ user_id: user._id,
                              fileName: 'something.txt',
                              fileSize: 100,
                              fileType: 'text',
                              title: 'Something',
                              contents: 'some content',
                              tags: ['here', 'are', 'some', 'tags']
                            });
    done();
  });

  it('should save without error', function(done) {
    corpus.save(done);
  });

  it('should add a corpus', function(done){
    corpus.save(function(err){
      expect(err).to.be.null;
      Corpus.find({}, function(err, corpora){
        expect(err).to.be.null;
        expect(corpora).to.have.length(1);
        expect(corpora[0].user_id).to.eql(user._id);
        expect(corpora[0]).to.have.property('fileName', 'something.txt');
        expect(corpora[0]).to.have.property('fileSize', 100);
        expect(corpora[0]).to.have.property('fileType', 'text');
        expect(corpora[0]).to.have.property('title', 'Something');
        expect(corpora[0]).to.have.property('contents', 'some content');
        expect(corpora[0].tags).to.include('here');
        expect(corpora[0].tags).to.include('are');
        expect(corpora[0].tags).to.include('some');
        expect(corpora[0].tags).to.include('tags');
        done();
      });
    });
  });

  describe('validations', function(){
    it('should not save when there is no owner', function(done){
      corpus.user_id = null;
      corpus.save(function(err){
        expect(err.errors.user_id).to.not.be.null;
        done();
      });
    });

    it('should not save when there is no filename', function(done){
      corpus.fileName = null;
      corpus.save(function(err){
        expect(err.errors.fileName).to.not.be.null;
        done();
      });
    });

    it('should not save when there is no file size', function(done){
      corpus.fileSize = null;
      corpus.save(function(err){
        expect(err.errors.fileSize).to.not.be.null;
        done();
      });
    });

    it('should not save when there is no file type', function(done){
      corpus.fileType = null;
      corpus.save(function(err){
        expect(err.errors.fileType).to.not.be.null;
        done();
      });
    });

    it('should not save when there is no title', function(done){
      corpus.title = null;
      corpus.save(function(err){
        expect(err.errors.title).to.not.be.null;
        done();
      });
    });
  });

  after(function(done){
    User.remove({}, done);
  });

  afterEach(function(done){
    Corpus.remove({}, done);
  });
});
