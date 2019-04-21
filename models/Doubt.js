const mongo = require('./database')
const DoubtSchema = mongo.Schema({
    duvida: {
        type: String,
        require: true
    },
    status:{
        type: Boolean,
        require: true
    },
    resposta:{
        type: String,
        require: false
    },
    createAt:{
        type: Date,
        require: true
    },
    updateAt:{
        type: Date,
        require: true
    }
})

mongo.model('doubts', DoubtSchema)

const doubts = mongo.model('doubts')

module.exports = doubts