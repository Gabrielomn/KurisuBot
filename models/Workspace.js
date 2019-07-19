const mongo = require('./database')
const WorkSpaceSchema = mongo.Schema({
    adm: {
        type: Array,
        require: true
    },
    workspace:{
        type: String,
        require: true
    },
    channelPost:{
        type: String,
        require: true
    },
    channelNotification:{
        type: String,
        require: true
    }
})

mongo.model('workspaces', WorkSpaceSchema)
const workspaces = mongo.model('workspaces')
module.exports = workspaces