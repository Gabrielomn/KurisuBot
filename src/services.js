piii = require('./StinkyWordsFilter')
const axios = require('axios')
const idGabriel = "UHN2NCEF4"
const SlackBot = require('slackbots')
var runningChats = new Object();


const bot = new SlackBot({
    token:'xoxb-610927659380-605202731841-SnjbA9emnZI5rdokgzbzCD8A',
    name: 'KurisuBot'
})

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
        services.handleMessage(data)
    }
})
/*
var handleMessage = function (data){
    
    if(!piii.has(data.text)){
        postToDuvidas(data.text);
        returnMessage(data.user, 'Olar, oq vc precisa?')
    }else{
        returnMessage(data.user, 'Sem palavrão. PALHAÇO')
    }
}
*/

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
    returnMessage(data.user, 'Certo, que tipo de dúvida vc tem?\n' + listaCategoriasDuvidas() + "\ndigita apenas o número correspondente plz.")
    runningChats[data.user] = lidaComTipoDeDuvida
}

var lidaComTipoDeDuvida = (data) => {
    if(iUnderstoodTheDoubt(data.text)){
        var categoria = data.text
        returnMessage(data.user, 'Certo, manda a mensagem que eu encaminho para o dúvidas para vc')
        runningChats[data.user] = function(data){
            let mensagem = `Duvida sobre ${categorizer(categoria) + "\n" + data.text}` 
            postToDuvidas(mensagem)
            delete runningChats[data.user]
        }
    }
}

var categorizer = function(value){
    if(value == 1){
        return "Orientação a objeto"
    }else if(value == 2){
        return "Manipulação de coleções"
    }else if(value == 3){
        return "Testes"
    }else if(value == 4){
        return "Cronogramas"
    }else if(value == 5){
        return "Outros"
    }
    
}

var iUnderstoodTheDoubt = (text) => {
    let expressaoEsperada = /(^[0-5]{1}$)/
    return expressaoEsperada.test(text)
}


var listaCategoriasDuvidas = function(){
    let saida = "1. Orientação a objeto\n2.Manipulação de coleções\n3.Testes\n4.Cronogramas\n5.Outros\n Digaí o tipo de dúvida ;)"
    return saida
}



var returnMessage = function (id, resposta){
    bot.postMessageToUser(getUserNameById(id), resposta)  
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

var chuckNorris = function (){
 
    axios.get('https://api.chucknorris.io/jokes/random').then(res =>{
        joke = res.data.value
        postToGeneral(`ChuckNorris joke: ${joke}`)
    })
}
//============================================== FERRAMENTAS ==============================================

var getUserNameById = function (id){
    let listaAux

    listaAux = bot.users.filter((user) =>{
        return user.id == id;
    })

    return listaAux[0].name
}

var services = {
    handleMessage: handleMessage,
    chuckNorris: chuckNorris,
    postToDuvidas: postToDuvidas,
    postToGeneral: postToGeneral,
    getUserNameById: getUserNameById,
    returnMessage: returnMessage
}

module.exports = services
