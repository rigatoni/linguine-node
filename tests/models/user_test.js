var chai = require('chai');
var expect = chai.expect;
var app = require('../../app')
var User = require('../../models/user');

describe('User', function(){

  it('should save without error', function(done) {
    var user = new User({name: 'John Doe', dce: 'jcd1234'});
    user.save(done);
  });

  it('should add a user', function(done){
    User.create({name: 'John Doe', dce: 'jcd1234'}, function(err, user){
      User.find({}, function(err, users){
        expect(users).to.have.length(1);
        expect(users[0]).to.have.property('name', 'John Doe');
        expect(users[0]).to.have.property('dce', 'jcd1234');
        done();
      });
    });
  })

  afterEach(function(done){
    User.remove({}, done);
  });
});
