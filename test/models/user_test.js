var chai = require('chai');
var expect = chai.expect;
var User = require('../../models/user');

describe('User', function(){
  var user;

  beforeEach(function(done){
    user = new User({name: 'John Doe', dce: 'jcd1234'});
    done();
  });

  it('should save without error', function(done) {
    user.save(done);
  });

  it('should add a user', function(done){
    user.save(function(err, user){
      expect(err).to.be.null;
      User.find({}, function(err, users){
        expect(err).to.be.null;
        expect(users).to.have.length(1);
        expect(users[0]).to.have.property('name', 'John Doe');
        expect(users[0]).to.have.property('dce', 'jcd1234');
        done();
      });
    });
  });

  describe('validations', function(){
    it('should not save with no name', function(done){
      user.name = null;
      user.save(function(err){
        expect(err.errors.name).to.not.be.null;
        done();
      });
    });

    it('should not save with no dce', function(done){
      user.dce = null;
      user.save(function(err){
        expect(err.errors.dce).to.not.be.null;
        done();
      });
    });
  });

  afterEach(function(done){
    User.remove({}, done);
  });
});
