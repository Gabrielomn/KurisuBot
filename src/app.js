//============================================== VARIAVEIS ==============================================

const SlackBot = require('slackbots')
const axios = require('axios')
const Piii = require("piii")
const piiiFilters = require("piii-filters")
const duvidas = Array()
var meuId = 'UHN2NCEF4'

const piii = new Piii({
  filters: [
    ...Object.values(piiiFilters)
  ]
});

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
        handleMessage(data)
    }
})
//============================================== AÇÕES ==============================================
function handleMessage(data){
    
    if(!piii.has(data.text)){
        postToDuvidas(data.text);
        returnMessage(data.user, 'Ta bom, vou enviar a duvida pro duvidas por vc ;)')
    }else{
        chuckNorris()
        returnMessage(data.user, 'Sem palavrão. PALHAÇO')
    }
}

function returnMessage(id, resposta){
    bot.postMessageToUser(achaNomeDoUsuarioPorId(id), resposta)  
}

function postToDuvidas(message){
    bot.postMessageToChannel('duvidas', "------ DUVIDA ------\n" + message)
}

function postToGeneral(message){
    var params = {
        icon_emoji : ':cat:'
    }

    bot.postMessageToChannel('general', message, params)
}

function chuckNorris(){
 
    axios.get('https://api.chucknorris.io/jokes/random').then(res =>{
        joke = res.data.value
        postToGeneral(`ChuckNorris joke: ${joke}`)
    })
}
//============================================== FERRAMENTAS ==============================================

function achaNomeDoUsuarioPorId(id){
    for(i = 0; i < bot.users.length;i++){
        if(bot.users[i].id == id){
            return bot.users[i].name
        }
    }
}

module.exports = {
    bot,
    handleMessage,
    chuckNorris,
    postToDuvidas,
    postToGeneral,
}