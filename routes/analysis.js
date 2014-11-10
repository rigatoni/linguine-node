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

module.exports = function (app) {
  app.use('/api/analysis', router);
}
