var express = require('express');
var router = express.Router();

var Analysis = require('../models/analysis');

router.get('', function(req, res) {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
      error: 401
    });
  } else {
    Analysis.where().select('analysis corpora_ids').exec(function (err, analyses) {
      res.json(analyses);
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
    Analysis.findById(req.params.id, function (err, analysis) {
      res.json(analysis);
    });
  }
});

module.exports = function (app) {
  app.use('/api/analysis', router);
}
