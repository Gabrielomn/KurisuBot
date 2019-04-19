piii = require('./StinkyWordsFilter')
const axios = require('axios')
const idGabriel = "UHN2NCEF4"
const SlackBot = require('slackbots')

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

var handleMessage = function (data){
    
    if(!piii.has(data.text)){
        postToDuvidas(data.text);
        returnMessage(data.user, 'Ta bom, vou enviar a duvida pro duvidas por vc ;)')
    }else{
        chuckNorris()
        returnMessage(data.user, 'Sem palavrão. PALHAÇO')
    }
}

var returnMessage = function (id, resposta){
    bot.postMessageToUser(getUserNameById(id), resposta)  
}

var postToDuvidas = function (message){
    bot.postMessageToChannel('duvidas', "------ DUVIDA ------\n" + message)
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
