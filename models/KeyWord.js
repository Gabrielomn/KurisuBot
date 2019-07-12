const mongo = require('./database')
const KeyWordSchema = mongo.Schema({
    key: {
        type: String,
        require: true
    },
    link:{
        type: String,
        require: true
    },
    workspace:{
        type: String,
        require: true
    }
})

mongo.model('keywords', KeyWordSchema)

const keywords = mongo.model('keywords')

module.exports = keywords