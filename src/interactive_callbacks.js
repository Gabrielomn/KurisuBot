const msgs = require('./jsonMessages')
const tools = require('./tools')
const webClient = require('./config').slackWeb
const keywords = require('../models/KeyWord')
const doubts = require('../models/Doubt')
const axios = require('axios')
const acessToken = require('./secrets').oAuth
const idChannelDuvidas = "CHT932M7T"

handleOpenDoubt = (obj) => {
    keywords.find().then(( res )  => {
        let arr = res.map((categoria)=> {return {value : categoria.key, label : categoria.key}})
        let msg = JSON.parse(JSON.stringify(msgs.dialog))
        msg.trigger_id = obj.trigger_id
        msg.dialog.elements[0].options = arr
        webClient.dialog.open(msg).catch(err => {
            console.log(err.data.response_metadata.messages)
        })
    })
}

handleEditDoubt = (obj) => {
    doubts.find({"idUser" : obj.user.id, "status" : false}).then(res => {
        let arr = res.map((duvida) => {return {value : duvida.ts, label : duvida.duvida}})
        let msg = JSON.parse(JSON.stringify(msgs.showDoubts))
        msg.trigger_id = obj.trigger_id
        msg.dialog.elements[0].options = arr
        webClient.dialog.open(msg).catch(err => {
            console.log(err.data.response_metadata.messages)
        })
    })
}

handleAlunoChoice = (obj) => {
    if(obj.actions[0].name === "open_doubt"){
        handleOpenDoubt(obj)
    }else if(obj.actions[0].name === "edit_doubt"){
        handleEditDoubt(obj)
    }
}

handleEditChoice = obj => {
    if(obj.submission.close_open === "open"){
        handleKeepOpenDoubt(obj)
    }else if(obj.submission.close_open === "close"){
        handleCloseDoubt(obj)
    }
}

handleKeepOpenDoubt = (obj) => {
    webClient.chat.postMessage({channel : idChannelDuvidas, thread_ts : obj.submission.doubt_select, text : obj.submission.doubt_body}).catch(err => {
        if(err.data.error === "no_text"){
            webClient.chat.postMessage({channel:obj.channel.id,user: obj.user.id, text:"https://giphy.com/gifs/why-ryan-reynolds-1M9fmo1WAFVK0"})
        }
    })
}

handleCloseDoubt = obj => {
    webClient.chat.postMessage({channel : idChannelDuvidas, thread_ts : obj.submission.doubt_select, text : obj.submission.doubt_body}).catch(err => {
        if(err.data.error === "no_text"){
            webClient.chat.postMessage({channel:obj.channel.id,user: obj.user.id, text:"https://media.tenor.com/images/1fd5f445304622bdb2da23c5762ce276/tenor.gif"})
        }
    })
    axios.get("https://slack.com/api/channels.replies?token=" + acessToken +"&channel=" + idChannelDuvidas + "&thread_ts=" + obj.submission.doubt_select).then(res => {
        let resp = new Array()
        for(let i = 1; i < res.data.messages.length; i++){
            resp.push(res.data.messages[i].text)
        }
        let date = new Date()
        var newValues = {status: true, resposta: resp, updateAt: date}
        let query = {ts: obj.submission.doubt_select, status: false}
        doubts.updateOne(query, newValues, (err, res) => {
            if(err) throw new err
            console.log( "Doubt was updated with sucess")
        })
    })
}

handleNewDoubtDialog = (obj) =>{
    let msg = obj.submission.doubt_body
    let idUser = obj.user.id
    let categoria = obj.submission.doubt_category
    let mensagem = `Nova dúvida sobre: *${categoria.toUpperCase()}*\nDuvida: ${msg}` 
    webClient.chat.postMessage({channel : idChannelDuvidas, text : mensagem}).then((res) => {
        tools.saveDoubt(res.ts, categoria, msg, idUser)
    })
    keywords.findOne({"key" : obj.submission.doubt_category}).then(res => {
        webClient.chat.postMessage({channel: obj.channel.id, text : `Enquanto ninguém responde sua dúvida este *link sobre ${categoria}* pode ser útil: \n` + res.link})
    })
    
}

module.exports = {
    "aluno_choice" : handleAlunoChoice,
    "open_doubt_dialog" : handleNewDoubtDialog,
    "edit_doubt" : handleEditChoice
}