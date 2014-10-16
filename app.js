var express = require('express');
var app = express();
var path = require('path');
var auth = require('./config/auth');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
auth(app);
app.use(function(req, res, next) {
  res.render('index');
});


app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: err.status || 500
  });
});


var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
