var express = require('express');
var router = express.Router();
var _ = require('lodash');
var request = require('request');

router.get('', function(req, res) {

});

router.post('', function(req, res) {

});


module.exports = function (app) {
  app.use('/api/documentation', router);
}
