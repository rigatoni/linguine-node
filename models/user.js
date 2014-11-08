var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  dce: { type: String, required: true },
  name: { type: String, required: true },
  corpora: [{type: Schema.Types.ObjectId, ref: 'Corpus'}]
});

module.exports = mongoose.model('User', userSchema);
