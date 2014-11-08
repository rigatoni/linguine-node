var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var corpusSchema = new Schema({
  _owner:     {type: Schema.Types.ObjectId, ref: 'User', required: true},
  createdAt:  {type: Date, default: Date.now},
  fileName:   {type: String, required: true},
  fileSize:   {type: Number, required: true},
  fileType:   {type: String, required: true},
  title:      {type: String, required: true},
  contents:   String,
  tags:       [String]
});

module.exports = mongoose.model('Corpus', corpusSchema);
