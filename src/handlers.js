const piii = require('./StinkyWordsFilter')
const tools = require('./tools.js')
const secrets = require('./secrets')
var runningChats = new Object();
const bot = require('./config').bot


//============================================== FUNÇÕES ==============================================
let handleReply = function(data) {
    tools.closeDoubt(data)
}

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
    postToDuvidas

}