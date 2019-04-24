piii = require('./StinkyWordsFilter')
const axios = require('axios')
const tools = require('./tools.js')
const idGabriel = "UHN2NCEF4"
const doubts = require('./../models/Doubt')


var runningChats = new Object();

bot = require('./config.js')
//============================================== STATUS ==============================================

bot.on('start', () =>{

    bot.postMessageToChannel('general', 
    'Im ready guysss')
})

    //Error Handler
bot.on('error', (err) => console.log(err));

//Message Handler
bot.on('message', (data) => {
    if(data.type !== 'message'){
        return;
    }
    if(data.user != bot.user){
        handleMessage(data)
    }
})

var handleMessage = function (data){
    
    if(!piii.has(data.text)){
        id = data.user
        if(tools.isChannel(data.channel)){
            handleChannelMensage(data)
        }else{
            if(!runningChats.hasOwnProperty(id)){
                returnMessage(data.user, 'Olar, oq vc precisa?')
                runningChats[data.user] = handleInitial
            }else{
                runningChats[data.user](data)
            }
        }   
    }else{
        returnMessage(data.user, 'Sem palavrão. PALHAÇO')
    }
}

var handleChannelMensage = function (data){
    tools.postCommand(data.channel, data.user, data.text)
}
 
var handleInitial = function(data){
    console.log(data.user + " " + data.text)
    if(tools.isCommand(data.text)){
        if(tools.isAdmin(data.user)){
            returnMessage(data.user, 'Certo, digite o comando da seguinte maneira: chave link')
            runningChats[data.user] = handleCommand
        }else{
            bot.postMessageToUser(tools.getUserNameById(bot.users, data.user), "Você não está autorizado a utilizar esse comando.")
            delete runningChats[data.user]
        }
    }else{
        handleDuvida(data)
        runningChats[data.user] = dealsWithDoubtCategory
    }
}

var handleCommand = function(data){
    tools.saveCommand(data.text)
    delete runningChats[data.user]
}


var handleDuvida = function(data){
    returnMessage(data.user, 'Certo, que tipo de dúvida vc tem?\n' + tools.listCategories() + "\ndigita apenas o número correspondente plz.")
    runningChats[data.user] = dealsWithDoubtCategory
}

var dealsWithDoubtCategory = (data) => {
    if(tools.iUnderstoodTheDoubt(data.text)){
        var categoria = data.text
        returnMessage(data.user, 'Certo, manda a mensagem que eu encaminho para o dúvidas para vc')
        runningChats[data.user] = function(data){
            let mensagem = `Nova dúvida sobre: *${tools.categorizer(categoria).toUpperCase()}*\nDuvida: ${data.text}` 
            postToDuvidas(mensagem)
            tools.saveDoubt(data.text)
            //tools.findAndSendLinks(tools.getUserNameById(bot.users, data.user), data.text) //Modo no qual as palavras chaves são procuradas na frase
            tools.postLink(tools.getUserNameById(bot.users, data.user), tools.categorizer(categoria)) //Modo no qual a categoria é escolhida pelo número
            delete runningChats[data.user]
        }
    }
}

var returnMessage = function (id, resposta){
    bot.postMessageToUser(tools.getUserNameById(bot.users, id), resposta)  
}

var postToDuvidas = function (message){
    bot.postMessageToChannel('duvidas',message)
}

var postToGeneral = function(message){
    var params = {
        icon_emoji : ':cat:'
    }
    bot.postMessageToChannel('general', message, params)
}

