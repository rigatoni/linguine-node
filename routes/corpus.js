var express = require('express');
var _ = require('lodash');
var router = express.Router();

var Corpus = require('../models/corpus');

router.get('', function(req, res) {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
      error: 401
    });
  } else {
    Corpus.where('userId').equals(req.user._id).select('title fileName tags').exec(function (err, corpora) {
      res.json(corpora);
    });
  }
});

router.delete('/:id', function (req, res) {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
      error: 401
    });
  } else {
    Corpus.findById(req.params.id, function (err, corpus) {
      if (corpus.userId == req.user._id) {
        Corpus.remove({_id: req.params.id}, function (err) {
          res.json(err);
        });
      } else {
        res.status(401).json({
          message: "Unauthorized",
          error: 401
        });
      }
    });

  }
});

router.get('/:id', function (req, res) {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
      error: 401
    });
  } else {
    Corpus.findById(req.params.id, function (err, corpus) {
      if (corpus.userId == req.user._id) {
        res.json(corpus);
      } else {
        res.status(401).json({
          message: "Unauthorized",
          error: 401
        });
      }
    });
  }
});

router.post('', function(req, res) {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
      error: 401
    });
  } else {
    var payload = _.extend(req.body, {userId: req.user._id});
    Corpus.create(req.body, function(err, corpus) {
      res.json(corpus);
    });
  }
});

module.exports = function (app) {
  app.use('/api/corpora', router);
}
