var fs = require('fs');
module.exports = function(app){
  require('./analysis')(app);
  require('./auth')(app);
  require('./corpora')(app);
  require('./documentation')(app);
  require('./templates')(app);
}
