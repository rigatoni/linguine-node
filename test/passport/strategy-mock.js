var passport = require('passport');
var util = require('util');

function StrategyMock(options, verify) {
  this.name = 'ldapauth';
  this.verify = verify;
}

util.inherits(StrategyMock, passport.Strategy);

StrategyMock.prototype.authenticate = function authenticate(req) {
  if (req.body.username === req.body.password) {
    var user = { uid: req.body.username, cn: req.body.username };
    var self = this;
    this.verify(user, function(err, u) {
      if(err) {
        self.fail(err);
      } else {
        self.success(u);
      }
    });
  } else {
    this.fail('Unauthorized');
  }
}

module.exports = StrategyMock;
