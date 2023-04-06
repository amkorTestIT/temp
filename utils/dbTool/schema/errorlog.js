var mongoose = require('mongoose')
var clientErrorLogSchema = mongoose.Schema(
    {
        pageUrl: String,
        errorLog: String,
        browserType: String,
        version: String,
        createdTime: String,
    },
    { versionKey: false }
)
clientErrorLogSchema.set('collection', 'clientErrorLog')
exports.clientErrorLogSchema = mongoose.model('errorlog', clientErrorLogSchema)
