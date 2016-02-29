var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var analysisSchema = new Schema({
  user_id:     {type: Schema.Types.ObjectId, ref: 'User', required: true},
  analysis_name: {type: String, required: true},
  analysis:    {type: String, required: true},
  corpora_ids: [{type: String, required: true}],
  timestamp: {type: String, required: true},
  result:      Schema.Types.Mixed
});

module.exports = mongoose.model('Analysis', analysisSchema);
