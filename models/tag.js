var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
  user_id:  {type: Schema.Types.ObjectId, ref: 'User', required: true},
  title:    {type: String, required: true}
});

module.exports = mongoose.model('Tag', tagSchema);
