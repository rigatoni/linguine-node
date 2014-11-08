var mongoose = require('mongoose');

before(function(){
  mongoose.connect('mongodb://localhost/linguine-test');
});

after(function(){
  mongoose.connection.close()
});
