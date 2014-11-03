var chai = require('chai');
var mongoose = require('mongoose');
var expect = chai.expect;
var User = require('../../models/user');
mongoose.connect('mongodb://localhost/linguine-test');

describe('User', function(){

  it('should save without error', function(done) {
    var user = new User({name: 'John doe', dce: 'jcd1234'});
    user.save(done);
  });

  it('should add a user', function(done){
    User.create({name: 'John doe', dce: 'jcd1234'}, function(err, user){
      User.find({}, function(err, users){
        expect(users).to.have.length(1);
        done();
      });
    });
  })

  afterEach(function(done){
    User.remove({}, done);
  });
});
