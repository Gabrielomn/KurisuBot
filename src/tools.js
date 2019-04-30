const idChannelGeneral = "CHN2NCVU2"
const idChannelDuvidas = "CHT932M7T"
const bot = require('./config')
const channels =[idChannelGeneral, idChannelDuvidas]
const acessToken = "xoxp-610927659380-600090422514-610939816692-08171c593ebfe0ab86a30daf2522747b"
const keywords = require('../models/KeyWord')
const doubts = require('./../models/Doubt')
const commands = require('./../models/Command');
const db = require('../models/database')
const axios = require('axios')
const admins = ["UHN2NCEF4", "UHU430TCH"]
const categories = {
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

//MÉTODOS DE VALIDAÇÃO/BUSCA
var possiblyUsefulLink = function(categoria){

    db.procuraPorKey(categoria).then(resultado => {
        return resultado.links
    })
}

var categorizer = function(value){
    return categories[value]    
}

var iUnderstoodTheDoubt = (text) => {
    let expected = /(^[1-9]|10|11$)/
    return expected.test(text)
}

var listCategories = function(){
    let saida = ""
    for(var key in categories){
        saida += key + "." + categories[key] + "\n"
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

var isChannel = function(string){

    if (channels.includes(string)){
        return true;
    }else{
        return false;
    }
}

var isAdmin = (user) => {
    return admins.includes(user)
}

function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
}

let update = () =>{
    findPendingDoubts((err, duvidas) => {
        if(err) console.log('erro: ' + err)
        else{
            bot.postMessageToChannel('dev', 'DUVIDAS NAO RESPONDIDAS SEUS CORNOS')
        }
    })
}

let findPendingDoubts =  (callback)=>{
    doubts.find({'status':false}, (err, res) =>{
        if(err) callback(err, null)
        if(res!=null){
            doubt = res
            callback(null, doubt)
        }
    })
}

//METODOS QUE ATUAM SOBRE OS COMANDOS
var getCommand = (text, callback) => {
    commands.findOne({'command' : text}, (err, res) => {
        if(err) callback(err, null)
        if(res != null){
            info = res.info
            callback(null, info)
        }else{
            if(text.charAt(0) === "!"){
                info = "Comando inexistente"
                callback(null, info)
            }
        }
    })
}

var postCommand = (data) => {
    getCommand(data.text, (err, info) => {
        if(err) console.log("erro: " + err)
        else{
            bot.postEphemeral(data.channel, data.user, info)
        }
    })
    
}

var admCommands = ['!addCommand', '!delCommand']

var isCommand = (msg) =>  {
    if(admCommands.includes(msg)){
        return true
    }else{
        return false;
    }
} 

var saveCommand = (msg) => {
    let c = msg.split(" ")

    if(c.length == 2){
        new commands({
            command:c[0],
            info:c[1]
    }).save().then(() => {
        console.log('Novo comando salvo com sucesso')
    }).catch(err => {
        console.log('erro: ' + err)
        })
    }
}

var delCommand = (comando) => {
    commands.deleteOne({'command' : comando},(err, res) => {
        if(err) console.log('Erro ao deletar o comando '+comando + ", erro: " + err)
        console.log("Comando deletado com sucesso")
    })
}

//METODOS QUE ATUAM SOBRE AS KEYWORDS
var getLink = (categoria, callback) =>{
    keywords.findOne({'key' : categoria}, (err, res) => {
        if(err) callback(err, null)
        if(res != null){
            link = res.link
            callback(null, link)
        }
    })
}

var postLink = (user, categoria) => {
    getLink(categoria, (err, link) => {
        if(err) console.log("erro: " + err)
        else{
            bot.postMessageToUser(user,"Enquanto ninguém responde esse link pode ajudar: " +  link)
        }
    })
}

//METODOS QUE ATUAM SOBRE AS DUVIDAS
var saveDoubt = (ts, msg, id) => {
    let date = new Date().getDate()
    new doubts ({
        ts: ts,
        duvida: msg,
        idUser: id,
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

var closeDoubt = function(data) {
    if(data.text == '!close'){
        axios.get("https://slack.com/api/conversations.history?token=" + acessToken + "&channel=" + idChannelDuvidas + "&latest=" + data.thread_ts+"&limit=1&inclusive=true").then(res => {
            console.log(res.data.messages[0].replies)
        })
        var newValues = {status: true}
        let query = {ts: data.thread_ts}
        doubts.updateOne(query, newValues, (err, res) => {
        
            if(err) throw new err
            console.log( "Sucess Update")
        })
    }
}

module.exports = {
    getUserNameById,
    listCategories,
    iUnderstoodTheDoubt,
    categorizer,
    isChannel,
    possiblyUsefulLink,
    categories,
    postLink,
    saveDoubt,
    isCommand,
    saveCommand,
    postCommand,
    isAdmin,
    delCommand,
    update,
    findPendingDoubts,
    closeDoubt
}