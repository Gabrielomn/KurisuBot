const mongo = require('./database')
const DoubtSchema = mongo.Schema({
    ts: {
        type: String,
        require: true,
        unique: true
    },
    topico: {
        type: String,
        require: true
    },
    duvida: {
        type: String,
        require: true
    },
    idUser:{
        type: String,
        require: true
    },
    status:{
        type: Boolean,
        require: true
    },
    resposta:{
        type: Array,
        require: false
    },
    workspace:{
        type: String,
        require: true
    }
    ,
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

