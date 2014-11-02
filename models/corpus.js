var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var corpusSchema = new Schema({
  userId:     String,
  created_at: {type: Date, default: Date.now},
  file_name:  String,
  file_size:  Number,
  file_type:  String,
  title:      String,
  contents:   String,
  tags:       [String]
});

module.exports = mongoose.model('Corpus', corpusSchema);
