const bot = require('./config').bot
const acessToken = process.env.oAuthToken;
const webClient = require('./config').slackWeb
const doubts = require('./../models/Doubt')
const workspaces = require('../models/Workspace')
const msgs = require('./jsonMessages')
const axios = require('axios')

var getUserNameById = function (lista, id){
    let listaAux
    listaAux = lista.filter((user) =>{
        return user.id == id;
    })

    return listaAux[0].name
}

var isChannel = function(string){

    if (channels.includes(string)){
        return true;
    }else{
        return false;
    }
}

var isAdmin = async (user, workspace) => {
    console.log(workspace)
    let query = await workspaces.findOne({workspace : workspace})
    return query.adm.includes(user)
}

const MINUTESBACK = 300

let update = () =>{
    findPendingDoubts(async (err, duvidas) => {
        if(err) console.log('erro: ' + err)
        else{
            let workspace = bot.team.domain
            let date = getEarlierDateMillisecs(MINUTESBACK)
            doubts.updateMany({workspace: workspace, status:false, updateAt: {$lt: date}},{updateAt : new Date()}).then(res => {
            }).catch(err => console.log(err))
            if(duvidas.length){
                let postChannel = await getPostChannel()
                let notificationChannel = await getNotificationChannel()
                webClient.chat.postMessage({channel: notificationChannel, text: "*Duvidas em aberto:* "}).catch(res => console.log(res))
                for(let i = 0; i < duvidas.length; i++){
                    axios.get("https://slack.com/api/chat.getPermalink?token=" + acessToken +"&channel=" + postChannel + "&message_ts=" + duvidas[i].ts).then(res => {
                        webClient.chat.postMessage({channel: notificationChannel,text: `\n Tópico: ${duvidas[i].topico}. --> Link para a *<${res.data.permalink}|dúvida>*`})      
                    })
                }
                
            }
        }
    })
}

let findPendingDoubts =  (callback)=>{
    let date = getEarlierDateMillisecs(MINUTESBACK)
    console.log('looking for pending doubts')
    let workspace = bot.team.domain
    doubts.find({workspace: workspace,status:false, updateAt: {$lt: date}}, (err, res) =>{
        if(err) callback(err, null)
        if(res!=null){
            doubt = res
            callback(null, doubt)
        }
    })
    
}

const getEarlierDateMillisecs = (minutesBack) => {
    let date= new Date()
    let minutes = date.getMinutes()
    date.setMinutes(minutes - minutesBack)
    //let value = date.getTime()
    return date
}

const validateWorkSpace = async () =>{
    let workSpaceName = await webClient.team.info()
    let response = await workspaces.findOne({'workspace': workSpaceName.team.domain})
    return response
}

const sendConfigDialog = async () => {
    let primaryOwner = await searchPrimaryOwner()
    let msg = msgs.menuConfig
    let channel = await webClient.im.open({'user' : primaryOwner})
    msg.user = primaryOwner
    msg.channel = channel.channel.id
    webClient.chat.postMessage(msg)
}

const searchPrimaryOwner = async () => {
    let owner = await webClient.users.list()
    let idOwner;
    for(let i in owner.members){
        if(owner.members[i].is_primary_owner){
            idOwner = owner.members[i].id
            break
        }
    }
    return idOwner
}

//METODOS QUE ATUAM SOBRE AS DUVIDAS
var saveDoubt = (ts, tema, msg, id, workspace) => {
    let date = new Date()
    new doubts ({
        ts: ts,
        topico: tema,
        duvida: msg,
        idUser: id,
        status: false,
        resposta: '',
        workspace,
        createAt: date,
        updateAt: date
    }).save().then(()=>{
        console.log('Nova duvida salva com sucesso.')
    }).catch(err =>{
        console.log('Erro no salvamento de duvida: '+err)
    })
}

var closeDoubt = function(data) {
    if(data.text == '!close'){
        axios.get("https://slack.com/api/channels.replies?token=" + acessToken +"&channel=" + idChannelDuvidas + "&thread_ts=" + data.thread_ts).then(res => {
            let resp = new Array()
            for(let i = 1; i < res.data.messages.length-1; i++){
                resp.push(res.data.messages[i].text)
            }
            let date = new Date()
            var newValues = {status: true, resposta: resp, updateAt: date}
            let query = {ts: data.thread_ts, status: false}
            doubts.updateOne(query, newValues, (err, res) => {
                if(err) throw new err
                console.log( "Sucess Update")
            })
        })
    }
}

const sendDM = async (user, text) =>{
    let msg = {}
    let channel = await webClient.im.open({'user' : user})
    msg.text = text
    msg.user = user
    msg.channel = channel.channel.id
    webClient.chat.postMessage(msg)
}

const findIdByName = async (names) => {
    let users = await webClient.users.list()
    users = users.members
    let ids = []
    let editName = ""
    for(let i in names){
        editName = names[i].substring(1)
        for(let c in users){
            if(editName == users[c].name){
                ids.push(users[c].id)
                break
            }
        }
    }
    return ids
}

// ADM CONFIG

const addAdms = async (names, workspace) => {
    let newAdms = names.split(" ")
    let currAdms = await workspaces.findOne({'workspace' : workspace})
    currAdms = currAdms.adm
    newAdms = await findIdByName(newAdms)
    console.log(newAdms)

    for(let i in newAdms){
        if(!currAdms.includes(newAdms[i])){
            currAdms.push(newAdms[i])
        }
    }
    await workspaces.updateOne({'workspace' : workspace}, {'adm' : currAdms})
    console.log("Novos ADMs adicionados com sucesso.")
}

const delAdms = async (names, workspace) => {
    let newAdms = names.split(" ")
    let currAdms = await workspaces.findOne({'workspace' : workspace})
    currAdms = currAdms.adm
    newAdms = await findIdByName(newAdms)
    currAdms = currAdms.filter((adm) => !newAdms.includes(adm))
    await workspaces.updateOne({'workspace' : workspace}, {'adm' : currAdms})
    console.log("Adm's deletados com sucesso")
}

const getChannelName = (id) => {
    for(i in bot.channels){
        if(bot.channels[i].id === id){
            return bot.channels[i].name
        }
    }
}

const getPostChannel = async () =>{
    let workspace = await workspaces.findOne({workspace:bot.team.domain})
    console.log(workspace.channelPost)
    return workspace.channelPost
}

const getNotificationChannel = async () => {
    let workspace = await workspaces.findOne({workspace:bot.team.domain})
    console.log(workspace.channelNotification)
    return workspace.channelNotification
}

module.exports = {
    getUserNameById,
    isChannel,
    saveDoubt,
    isAdmin,
    update,
    findPendingDoubts,
    closeDoubt,
    validateWorkSpace,
    sendConfigDialog,
    sendDM,
    addAdms,
    delAdms,
    getChannelName,
    getPostChannel
}
