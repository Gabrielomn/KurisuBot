const SlackBot = require('slackbots')
const axios = require('axios')
const Piii = require("piii");
const piiiFilters = require("piii-filters");

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

    handleMessage(data)

})

function handleMessage(data){
    
    if(!piii.has(data.text)){
        postToDuvidas(data.text);
    }else{
        chuckNorris()
    }
}




function returnMessage(id){
    bot.postMessageToUser(achaNomeDoUsuarioPorId(id), 'Ta bom, vou enviar a duvida pro duvidas por vc ;)')    
}


function achaNomeDoUsuarioPorId(id){
    for(i = 0; i < bot.users.length;i++){
        if(bot.users[i].id == id){
            return bot.users[i].name
        }
    }
}

function chuckNorris(){
 
    axios.get('https://api.chucknorris.io/jokes/random').then(res =>{
        joke = res.data.value
        postToGeneral(`ChuckNorris joke: ${joke}`)
    })
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

module.exports = {
    bot,
    handleMessage,
    chuckNorris,
    postToDuvidas,
    postToGeneral,
}