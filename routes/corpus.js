var express = require('express');
var _ = require('lodash');
var router = express.Router();

var Corpus = require('../models/corpus');

router.post('', function(req, res) {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
      error: 401
    });
  } else {
    var payload = _.extend(req.body, {userId: req.user._id});
    Corpus.create(req.body, function(err, corpus) {
      console.log(corpus);
      res.json(corpus);
    });
  }
});

module.exports = function (app) {
  app.use('/api/corpora', router);
}
