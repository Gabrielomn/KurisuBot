const idChannelGeneral = "CHN2NCVU2"
const idChannelDuvidas = "CHT932M7T"
const bot = require('./config')
const channels =[idChannelGeneral, idChannelDuvidas]
const keywords = require('../models/KeyWord')
const doubts = require('./../models/Doubt')
knownLinks = require('./commands.js')

const categorias = {
    1:"Orientação a objeto",
    2:"Manipulação de coleções",
    3:"Testes",
    4:"Sintaxe Java",
    5:"Composição de Classes",
    6:"Grasp",
    7:"Heranças",
    8:"Interfaces",
    9:"Exceções",
    10:"Cronogramas",
    11:"Outros"
}

const db = require('../models/database')

var teste = function(oi){
    return oi
}

var retornaLinkPossivelmenteUtil = function(categoria){

    db.procuraPorKey(categoria).then(resultado => {
        return resultado.links
    })
}

var categorizer = function(value){
    return categorias[value]    
}

var iUnderstoodTheDoubt = (text) => {
    let expressaoEsperada = /(^[1-9]|10|11$)/
    return expressaoEsperada.test(text)
}

var listaCategoriasDuvidas = function(){
    let saida = ""
    for(var key in categorias){
        saida += key + "." + categorias[key] + "\n"
    }

    return saida
}

var getUserNameById = function (lista, id){
    let listaAux
    listaAux = lista.filter((user) =>{
        return user.id == id;
    })

    return listaAux[0].name
}

var chuckNorris = function (){
 
    axios.get('https://api.chucknorris.io/jokes/random').then(res =>{
        joke = res.data.value
        return joke;
    })
}

var isChannel = function(string){

    if (channels.includes(string)){
        return true;
    }else{
        return false;
    }
}

var knownKeyWords = function(text){
    if(knownLinks.hasOwnProperty(text)){
        return knownLinks[text]
    }else{
        return ""
    }
}

var postLink = (user, categoria) => {
    keywords.findOne({'key': categoria}, (err, res) => {
        if(err){
            return
        }if(res != null){
            bot.postMessageToUser(user, res.link)
        }
    })
}

var saveDoubt = (msg) => {
    let date = new Date().getDate()
    new doubts ({
        duvida: msg,
        status: false,
        resposta: '',
        createAt: date,
        updateAt: date
    }).save().then(()=>{
        console.log('Nova duvida salva com sucesso.')
    }).catch(err =>{
        console.log('Erro no salvamento de duvida: '+err)
    })
}

var findAndSendLinks = (user, msg) => {
    let results = new Array()
    msg = titleCase(msg)
    keywords.find({}, (err, res) => {
        if(err) return
        for(i = 0; i < res.length; i++){
            if(msg.includes(res[i].key)){
                results.push(res[i].key)
            }
        }
        
        console.log(results)
    }).then(() => {
        bot.postMessageToUser(user, "Enquanto ninguém responde, pode ser que esse material ajude: \n")
        console.log(results)
        for(word in results){
            postLink(user, word)
        }
    })
}

function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
}

module.exports = {
    getUserNameById,
    listaCategoriasDuvidas,
    iUnderstoodTheDoubt,
    categorizer,
    chuckNorris,
    isChannel,
    knownKeyWords,
    retornaLinkPossivelmenteUtil,
    categorias,
    postLink,
    saveDoubt,
    findAndSendLinks
}