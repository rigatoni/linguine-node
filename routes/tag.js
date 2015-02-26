var _ = require('lodash');
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var Tag = require('../models/tag');

// Middleware runs on all tag requests
router.use(function(req, res, next) {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized",
      error: 401
    });
  } else {
    next();
  }
});

router.get('', function(req, res) {
  Tag.find({'user_id': req.user._id}, function (err, tags) {
    res.json(tags);
  });
});

router.delete('/:id', function (req, res) {
  Tag.findOneAndRemove({'_id': req.params.id, 'user_id': req.user._id}, function (err, tag) {
    res.status(204).json({});
  });
});

router.get('/:id', function (req, res) {
  Tag.findOne({'_id': req.params.id, 'user_id': req.user._id}, function (err, tag) {
    res.json(tag);
  });
});

/** Hack. Not ACID Compliant.
  * If a tag with this title already exists, return it.
  * Else, make a new document.
  */
router.post('', function(req, res) {
  Tag.findOne({'title': req.body.title, 'user_id': new ObjectId(req.user._id)}, function (err, tag) {
    if (tag) {
      res.status(201).json(tag);
    } else {
      var payload = _.merge(_.pick(req.body, 'title'), {'user_id': new ObjectId(req.user._id)});
      Tag.create(payload, function(err, tag) {
        res.status(201).json(tag);
      });
    }
  });
});

module.exports = function (app) {
  app.use('/api/tags', router);
}
