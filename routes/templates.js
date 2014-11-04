var express = require('express');
var router = express.Router();


router.get('/:directory/:file', function(req, res){
  res.render('templates/' + req.params.directory + '/' + req.params.file);
})


module.exports = function(app) {
  app.use('/templates', router);
}
