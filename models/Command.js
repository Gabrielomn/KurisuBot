const mongo = require('./database')
const CommandSchema = mongo.Schema({
    command: {
        type: String,
        require: true
    },
    info:{
        type: String,
        require: true
    }
})

mongo.model('commands', CommandSchema)

const commands = mongo.model('commands')

module.exports = commands