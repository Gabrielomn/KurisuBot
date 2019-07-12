const idChannelGeneral = "CHN2NCVU2"
const idChannelDuvidas = "CHT932M7T"
const bot = require('./config').bot
const channels =[idChannelGeneral, idChannelDuvidas]
const acessToken = require('./secrets').oAuth;
const webClient = require('./config').slackWeb
const doubts = require('./../models/Doubt')
const workspaces = require('../models/Workspace')
const msgs = require('./jsonMessages')
const axios = require('axios')
const admins = ["UHN2NCEF4", "UHU430TCH"]

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

var isAdmin = (user) => {
    return admins.includes(user)
}

const MINUTESBACK = 3

let update = () =>{
    findPendingDoubts((err, duvidas) => {
        if(err) console.log('erro: ' + err)
        else{
            let date = getEarlierDateMillisecs(MINUTESBACK)
            doubts.updateMany({status:false, updateAt: {$lt: date}},{updateAt : new Date()}).then(res => {
            }).catch(err => console.log(err))
            if(duvidas.length){
                bot.postMessageToChannel('dev',"*Duvidas em aberto:* ")
                for(let i = 0; i < duvidas.length; i++){
                    axios.get("https://slack.com/api/chat.getPermalink?token=" + acessToken +"&channel=" + "CHT932M7T" + "&message_ts=" + duvidas[i].ts).then(res => {
                        bot.postMessageToChannel('dev', "\n" + `Tópico: ${duvidas[i].topico}. --> Link para a *<${res.data.permalink}|dúvida>*`)      
                    })
                }
                
            }
        }
    })
}

let findPendingDoubts =  (callback)=>{
    let date = getEarlierDateMillisecs(MINUTESBACK)
    console.log('looking for pending doubts')
    doubts.find({status:false, updateAt: {$lt: date}}, (err, res) =>{
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

const validateWorkSpace = async () =>{ //mudar pro tools
    let workSpaceName = await webClient.team.info()
    let response = await workspaces.findOne({'workspace': workSpaceName.team.domain})
    return response
}

const sendConfigDialog = async () => { //mudar pro tools
    let primaryOwner = await searchPrimaryOwner()
    let msg = msgs.menuConfig
    let channel = await webClient.im.open({'user' : primaryOwner})
    msg.user = primaryOwner
    msg.channel = channel.channel.id
    webClient.chat.postMessage(msg)
}

const searchPrimaryOwner = async () => { //mudar pro tools
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

module.exports = {
    getUserNameById,
    isChannel,
    saveDoubt,
    isAdmin,
    update,
    findPendingDoubts,
    closeDoubt,
    validateWorkSpace,
    sendConfigDialog
}