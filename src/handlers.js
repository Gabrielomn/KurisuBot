const piii = require('./StinkyWordsFilter')
const tools = require('./tools.js')
const bot = require('./config').bot
const webClient = require('./config').slackWeb
const msgs = require('./jsonMessages')
const interactive_callbacks = require('./interactive_callbacks.js')
//============================================== FUNÇÕES ==============================================
let handleReply = function(data) {
    tools.closeDoubt(data)
}

let handleAddAdm = async (body) => {
    let user = body.user_id
    let workspace = body.team_domain
    let validation = await tools.isAdmin(user, workspace)
    if(validation){
        tools.addAdms(body.text, workspace)
        let msg = 'Naice'
        tools.sendDM(user, msg)
    }else{
        let msg = 'Só ADMs tem permissão para adicionar novos ADMs.'
        tools.sendDM(user, msg)
    }
}

let handleInteraction = function(body) {
    let obj = JSON.parse(body.payload)
    console.log(obj.callback_id)
    interactive_callbacks[obj.callback_id](obj)
}

var handleMessage = function (data){
    
    if(!piii.has(data.text)){

        id = data.user
        if(tools.isChannel(data.channel)){
            continue
        }else{
            if(tools.isAdmin(data.user)){
                let msg = msgs.msgParaAdmin
                msg.user = data.user
                msg.channel = data.channel
                webClient.chat.postMessage(msg)
            }else{
                let msg = msgs.msgParaAluno
                msg.user = data.user
                msg.channel = data.channel
                webClient.chat.postMessage(msg)
            }
        }   
    }else{
        webClient.chat.postMessage({users: data.user, channel: data.channel, text: "Sem palavrão. PALHAÇO"})
    }
}

const handleConfiguration = async () => {
    if(await tools.validateWorkSpace()){
        console.log("WorkSpace already registred")
    }else{
        await tools.sendConfigDialog() 
    }
}

var returnMessage = function (id, resposta){
    bot.postMessageToUser(tools.getUserNameById(bot.users, id), resposta)  
}

module.exports = {
    handleMessage,
    handleReply,
    handleInteraction,
    returnMessage,
    handleConfiguration,
    handleAddAdm
    
}