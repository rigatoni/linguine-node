var express = require('express');
var router = express.Router();
var _ = require('lodash');
var request = require('request');
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

router.post('', function(req, res) {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
      error: 401
    });
  } else {
    var payload = _.extend(req.body, {userId: req.user._id});
    request.post({
      url:     'http://localhost:5555',
      body:    JSON.stringify(payload)
    }, function(error, response, body) {
      res.json(body);
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
    Analysis.remove({_id: req.params.id}, function (err) {
      res.json(err);
    });
  }
});

module.exports = function (app) {
  app.use('/api/analysis', router);
}
