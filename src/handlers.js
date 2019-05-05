const piii = require('./StinkyWordsFilter')
const tools = require('./tools.js')
const secrets = require('./secrets')
var runningChats = new Object();
const bot = require('./config').bot
const webClient = require('./config').slackWeb
const msgs = require('./jsonMessages')

//============================================== FUNÇÕES ==============================================
let handleReply = function(data) {
    tools.closeDoubt(data)
}

let handleInteraction = function(body) {
    let obj = JSON.parse(body.payload)
    if(obj.actions[0].name == "open_doubt"){
        handleOpenDoubt(obj)
    }else if (obj.actions[0].name == "edit_doubt"){
        editDoubt(obj)
    }
}

let handleOpenDoubt = function(body){
    let msg = JSON.parse(JSON.stringify(msgs.dialog))
    msg.trigger_id = body.trigger_id
    webClient.dialog.open(msg).catch(err => {
        console.log(err.data.response_metadata.messages)
    }).then(()=> console.log('lol')    )
}

var handleMessage = function (data){
    
    if(!piii.has(data.text)){

        id = data.user
        if(tools.isChannel(data.channel)){
            handleChannelMensage(data)
        }else{
            let msg = msgs.msgParaAluno
            console.log(data)
            msg.user = data.user
            msg.channel = data.channel
            webClient.chat.postMessage(msg).catch((err) =>{
                if(err.data.error === "channel_not_found" ){
                    console.log('nao achei o canal')
                    webClient.im.open({return_im:true,user: data.user, token: secrets.oAuth}).catch(err =>{
                        console.log(err)
                    }).then((res) => {
                        console.log(res)
                        msg.channel = res.channel.id
                        msg.as_user = false
                        webClient.chat.postMessage(msg)
                    }).catch(err =>{
                        console.log(err)
                    })
                }
            })
            /*if(!runningChats.hasOwnProperty(id)){
                returnMessage(data.user, 'Olar, oq vc precisa?')
                runningChats[data.user] = handleInitial
            }else{
                runningChats[data.user](data)
            }*/

        }   
    }else{
        webClient.chat.postMessage({users: data.user, channel: data.channel, text: "Sem palavrão. PALHAÇO"})
        //returnMessage(data.user, 'Sem palavrão. PALHAÇO')
    }
}

var handleChannelMensage = function (data){
    tools.postCommand(data)
}
 
var handleInitial = function(data){
    if(tools.isCommand(data.text)){
        if(tools.isAdmin(data.user)){
            if(data.text === "!addCommand"){
                returnMessage(data.user, 'Certo, digite o comando da seguinte maneira: chave link')
                runningChats[data.user] = saveCommand
            }else if(data.text === "!delCommand"){
                returnMessage(data.user, 'Certo, qual comando deseja deletar?')
                runningChats[data.user] = delCommand
            }
        }else{
            bot.postMessageToUser(tools.getUserNameById(bot.users, data.user), "Você não está autorizado a utilizar esse comando.")
            delete runningChats[data.user]
        }
    }else{
        handleDuvida(data)
        runningChats[data.user] = dealsWithDoubtCategory
    }
}

var saveCommand = function(data){
    tools.saveCommand(data.text)
    bot.postMessageToUser(tools.getUserNameById(bot.users, data.user),"Comando criado com sucesso.")
    delete runningChats[data.user]
}

var delCommand = (data) => {
    tools.delCommand(data.text)
    bot.postMessageToUser(tools.getUserNameById(bot.users, data.user),"Comando deletado com sucesso.")
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
            tools.postLink(tools.getUserNameById(bot.users, data.user), tools.categorizer(categoria)) //Modo no qual a categoria é escolhida pelo número
            postToDuvidas(data, categoria)
            //tools.findAndSendLinks(tools.getUserNameById(bot.users, data.user), data.text) //Modo no qual as palavras chaves são procuradas na frase
            delete runningChats[data.user]
        }
    }
}

var returnMessage = function (id, resposta){
    bot.postMessageToUser(tools.getUserNameById(bot.users, id), resposta)  
}

var postToDuvidas = function (data, categoria){
    let msg = data.text
    let idUser = data.user
    let mensagem = `Nova dúvida sobre: *${tools.categorizer(categoria).toUpperCase()}*\nDuvida: ${data.text}` 

    bot.postMessageToChannel('duvidas',mensagem, (data) => {
      tools.saveDoubt(data.ts, msg, idUser)
    })
 }

var postToGeneral = function(message){
    var params = {
        icon_emoji : ':cat:'
    }
    bot.postMessageToChannel('general', message, params)
}


module.exports = {
    postToGeneral,
    handleChannelMensage,
    handleDuvida,
    handleInitial,
    handleMessage,
    handleReply,
    postToDuvidas,
    handleInteraction

}