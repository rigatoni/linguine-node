var passport = require('passport');
var LdapStrategy = require('passport-ldapauth').Strategy;

module.exports = function(app){
  app.use(passport.initialize());

  passport.use(new LdapStrategy({
    server: {
      url: 'ldap://ldap.rit.edu',
      searchBase: 'ou=people,dc=rit,dc=edu',
      searchFilter: '(uid={{username}})'
    }
  },
  function(user, done){
    done(null, user);
  }));

  app.post('/api/login', passport.authenticate('ldapauth', {session: false}), function(req, res) {
    res.send({status: 'ok'});
  });
}
