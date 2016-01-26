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
    Analysis.where('user_id').equals(req.user._id).exec(function (err, analyses) {
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
    var payload = _.extend(req.body, {user_id: req.user._id});
    request.post({
      url:     'http://localhost:5555',
      body:    JSON.stringify(payload)
    }, function(error, response, body) {
      console.log(error);
      res.status(response.statusCode).json(body);
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
    Analysis.findById(req.params.id, function (err, analysis) {
      if (analysis.user_id.equals(req.user._id)) {
        Analysis.remove({_id: req.params.id}, function (err) {
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

module.exports = function (app) {
  app.use('/api/analysis', router);
}
