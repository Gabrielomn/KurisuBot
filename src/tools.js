const idChannelGeneral = "CHN2NCVU2"
const idChannelDuvidas = "CHT932M7T"
const bot = require('./config')
const channels =[idChannelGeneral, idChannelDuvidas]
const keywords = require('../models/KeyWord')
const doubts = require('./../models/Doubt')
const commands = require('./../models/Command');
knownLinks = require('./commands.js')
const admins = ["UHN2NCEF4"]
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

const db = require('../models/database')

var teste = function(oi){
    return oi
}

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

var getLink = (user, categoria, callback) =>{
    keywords.findOne({'key' : categoria}, (err, res) => {
        if(err) callback(err, null)
        if(res != null){
            link = res.link
            callback(null, link)
        }
    })

}

var postLink = (user, categoria) => {
    getLink(user, categoria, (err, link) => {
        if(err) console.log("erro: " + err)
        else{
            bot.postMessageToUser(user,"Enquanto ninguém responde esse link pode ajudar: " +  link)
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

var isCommand = (user, msg) =>  {
    if(msg.includes('!runConfig')){
        if(admins.includes(user)){
            return true;
        }else{
            console.log('usuario nao autorizado: ' + getUserNameById(bot.users, user))
            return false;
        }
    }else{
        return false;
    }
}

var saveCommand = (msg) => {
    let c = msg.split(" ")

    if(c.length == 2){
        new commands({
            key:c[0],
            link:c[1]
    }).save().then(() => {
        console.log('novo comando salvo com sucesso')
    }).catch(err => {
        console.log('erro: ' + err)
    })
    }
}

var findAndSendLinks = (user, msg) => {
    let results = new Array()
    msg = titleCase(msg)
    
    keywords.find({}, (err, res) => {
        if(err) console.log('Erro: '+ err)
        for(i = 0; i < res.length; i++){
            if(msg.includes(res[i].key)){
                results.push(res[i].key)
            }
        }
        
    }).then(() => {
        if(results.length > 0){
            bot.postMessageToUser(user, "Enquanto ninguém responde, pode ser que esse material ajude.")
            for(word in results){
                postLink(user, results[word])
            }
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
    listCategories,
    iUnderstoodTheDoubt,
    categorizer,
    chuckNorris,
    isChannel,
    knownKeyWords,
    possiblyUsefulLink,
    categories,
    postLink,
    saveDoubt,
    findAndSendLinks,
    isCommand,
    saveCommand
}