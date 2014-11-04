var chai = require('chai');
var passport = require('passport');
var mongoose = require('mongoose');
var expect = chai.expect;
mongoose.connect('mongodb://localhost/linguine-test');

describe('User', function(){

  it('should add a user', function(done){
    User.create({name: 'John doe', dce: 'jcd1234'}, function(err, user){
      User.find({}, function(user){

      });
    });
  })
});
