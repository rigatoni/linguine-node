var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  dce: { type: String, required: true },
  name: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
