var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var analysisSchema = new Schema({ any: Schema.Types.Mixed });

module.exports = mongoose.model('Analysis', analysisSchema);
