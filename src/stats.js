const Doubt = require("../models/Doubt")
const keyword = require("../models/KeyWord")
const getStats = async () => {
    saida = []
    let keywords = await keyword.find()
    for(let k in keywords){
        let doubts = await Doubt.find({'topico': keywords[k].key})
        saida[k] = {
            label:keywords[k].key,
            value: doubts.length
        }    
    }
    console.log(saida)
    return saida
}

module.exports = {
    getStats
}