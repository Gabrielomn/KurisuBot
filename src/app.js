const SlackBot = require('slackbots')
const axios = require('axios')

const bot = new SlackBot({
    token:'xoxb-610927659380-605202731841-SnjbA9emnZI5rdokgzbzCD8A',
    name: 'KurisuBot'
})

bot.on('start', () =>{
    var params = {
        icon_emoji: ':cat'
    }
    bot.postMessageToChannel('general', 
    'sup mothefuckers', 
    params)
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
    if(!verificaPalavrao(data.text)){
        postToDuvidas(data.text);
    }else{
        chuckNorris()
    }
}

function verificaPalavrao(text){
    var stinkyWords = ["cu", "merda", "porra", "fdp", "filhaDaPuta"];
    for(i = 0; i < stinkyWords.length; i++){
        if(text.includes(stinkyWords[i])){
            return true;
        }
    }
    return false;
}

function chuckNorris(){
    var params = {
        icon_emoji : ':cat:'
    }
    axios.get('https://api.chucknorris.io/jokes/random').then(res =>{
        joke = res.data.value
        postToGeneral(`ChuckNorris joke: ${joke}`)
    })
}
function postToDuvidas(message){
    var params = {
        icon_emoji : ':cat:'
    }

    bot.postMessageToChannel('duvidas', "------ DUVIDA ------\n" + message, params)
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
    verificaPalavrao
}