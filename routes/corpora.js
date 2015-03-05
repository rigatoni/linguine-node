var express = require('express');
var router = express.Router();

var Corpus = require('../models/corpus');

// Middleware runs on all corpora API calls
router.use(function(req, res, next) {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
      error: 401
    });
  } else if (req.params.id) {
    Corpus.findById(req.params.id, function (err, corpus) {
      if (!corpus.user_id.equals(req.user._id)) {
        res.status(401).json({
          message: "Unauthorized",
          error: 401
        });
      }
    });
  } else {
    next();
  }
});

router.get('', function(req, res) {
  Corpus.where('user_id').equals(req.user._id).select('title fileName tags tag_ids').exec(function (err, corpora) {
    res.json(corpora);
  });
});

router.delete('/:id', function (req, res) {
  Corpus.findById(req.params.id, function (err, corpus) {
    Corpus.remove({_id: req.params.id}, function (err) {
      res.status(204).json({});
    });
  });
});

router.get('/quota', function(req, res) {
  Corpus.where({user_id: req.user._id }).exec(function(err, corpora) {
    var count = corpora.length;
    var size = corpora.reduce(function(sum, corpus) {
      return sum + corpus.fileSize;
    }, 0);
    res.json({ documents: count, total_size: size });
  });
})

router.get('/:id', function (req, res) {
  Corpus.findById(req.params.id, function (err, corpus) {
    res.json(corpus);
  });
});

router.post('', function(req, res) {
  req.body.user_id = req.user._id;
  Corpus.create(req.body, function(err, corpus) {
    res.status(201).json(corpus);
  });
});

router.put('/:id/addTag', function (req, res) {
  Corpus.findOneAndUpdate({"_id": req.params.id}, { $push: {tags: req.body.tagName}}, { safe: true }, function (err, response) {
    res.json(err);
  })
});

router.put('/:id/removeTag', function (req, res) {
  Corpus.findOneAndUpdate({"_id": req.params.id}, { $pull: {tags: req.body.tagName}}, { safe: true }, function (err, response) {
    res.json(err);
  })
});

module.exports = function (app) {
  app.use('/api/corpora', router);
}
