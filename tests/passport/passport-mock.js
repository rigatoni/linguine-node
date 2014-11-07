var passport = require('passport');
var StrategyMock = require('./strategy-mock');
var User = require('../../models/user')

module.exports = function(app, options) {
  var verify = function(user, done){
    User.find({ dce: user.username }).limit(1).exec(function(err, users){
      if(users.length === 0) {
        User.create({ dce: user.uid, name: user.cn }, function(err, user){
          done(null, user);
        });
      }else {
        done(null, users[0]);
      }
    });
  }
  passport.use(new StrategyMock(options, verify));
};
