var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var corpusSchema = new Schema({
  userId:     String,
  created_at: {type: Date, default: Date.now},
  fileName:   String,
  fileSize:   Number,
  fileType:   String,
  title:      String,
  contents:   String,
  tags:       [String]
});

module.exports = mongoose.model('Corpus', corpusSchema);
