var express = require('express');
var router = express.Router();

var Corpus = require('../models/corpus');
var fs = require('fs');

router.get('', function(req, res) {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
      error: 401
    });
  } else {
    Corpus.where('user_id').equals(req.user._id).select('title fileName tags').exec(function (err, corpora) {
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
      if (corpus.user_id.equals(req.user._id)) {
        Corpus.remove({_id: req.params.id}, function (err) {
          res.status(204).json({});
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

router.get('/quota', function(req, res) {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
      error: 401
    });
  } else {
    Corpus.where({user_id: req.user._id }).exec(function(err, corpora) {
      var count = corpora.length;
      var size = corpora.reduce(function(sum, corpus){
        return sum + corpus.fileSize;
      }, 0)

      res.json({ documents: count, total_size: size });
    });
  }
})

router.get('/:id', function (req, res) {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
      error: 401
    });
  } else {
    Corpus.findById(req.params.id, function (err, corpus) {
      if (corpus.user_id.equals(req.user._id)) {
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
    var file = req.files.file;
    fs.readFile(file.path, function(err, data){
      var corpus = {
        user_id: req.user._id,
        contents: data,
        title: req.body.title,
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type
      };

      Corpus.create(corpus, function(err, c) {
        res.status(201).json(c);
      });
    });
  }
});

module.exports = function (app) {
  app.use('/api/corpora', router);
}
