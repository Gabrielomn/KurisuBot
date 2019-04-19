piii = require('./StinkyWordsFilter')
const axios = require('axios')
const tools = require('./tools.js')
const idGabriel = "UHN2NCEF4"

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
bot.on('message', (data)=>{
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
        if(!runningChats.hasOwnProperty(id)){
            returnMessage(data.user, 'Olar, oq vc precisa?')
            runningChats[data.user] = handleDuvida
        }else{
            runningChats[data.user](data)
        }
    }else{
        returnMessage(data.user, 'Sem palavrão. PALHAÇO')
    }
}


var handleDuvida = function(data){
    returnMessage(data.user, 'Certo, que tipo de dúvida vc tem?\n' + tools.listaCategoriasDuvidas() + "\ndigita apenas o número correspondente plz.")
    runningChats[data.user] = lidaComTipoDeDuvida
}

var lidaComTipoDeDuvida = (data) => {
    if(tools.iUnderstoodTheDoubt(data.text)){
        var categoria = data.text
        returnMessage(data.user, 'Certo, manda a mensagem que eu encaminho para o dúvidas para vc')
        runningChats[data.user] = function(data){
            let mensagem = `Duvida sobre ${tools.categorizer(categoria) + "\n" + data.text}` 
            postToDuvidas(mensagem)
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