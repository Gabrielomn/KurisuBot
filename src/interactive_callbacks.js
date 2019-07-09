const msgs = require('./jsonMessages')
const tools = require('./tools')
const webClient = require('./config').slackWeb
const keywords = require('../models/KeyWord')
const doubts = require('../models/Doubt')
const axios = require('axios')
const acessToken = require('./secrets').oAuth
const idChannelDuvidas = "CHT932M7T"
const commands = require('../models/Command')

//TOMADAS DE DECISÃO

handleAlunoChoice = (obj) => {
    console.log(obj.actions[0].name)
    if(obj.actions[0].name === "open_doubt"){
        handleOpenDoubt(obj)
    }else if(obj.actions[0].name === "edit_doubt"){
        handleEditDoubt(obj)
    }else if(obj.actions[0].name === "command"){
        handleCommand(obj)
    }else if(obj.actions[0].name === "keyword"){
        handleKeyWord(obj)
    }
    // else if(obj.actions[0].name === "admins"){
    //     handleAdmins(obj)
    // }
}

handleAdmins = obj => {
    console.log(obj)
}

handleEditChoice = obj => {
    if(obj.submission.close_open === "open"){
        handleKeepOpenDoubt(obj)
    }else if(obj.submission.close_open === "close"){
        handleCloseDoubt(obj)
    }
}

//ATUA SOBRE COMANDOS.

handleCommandChoice = obj => {
    
    if(obj.actions[0].selected_options[0].value != "new_command"){
        let msg = JSON.parse(JSON.stringify(msgs.editCommand))
        msg.trigger_id = obj.trigger_id
        msg.dialog.elements[0].placeholder = obj.actions[0].selected_options[0].value
        webClient.dialog.open(msg).catch(err => {
            console.log(err.data.response_metadata.messages)
        })
    }else{
        let msg = JSON.parse(JSON.stringify(msgs.newCommand))
        msg.trigger_id = obj.trigger_id
        webClient.dialog.open(msg).catch(err => {
            console.log(err.data.response_metadata.messages)
        })
    }
}

handleCommand = obj => {
    commands.find().then(( res )  => {
        let arr = res.map((command)=> {return {value : command.command, text : command.command}})
        let msg = JSON.parse(JSON.stringify(msgs.selectCommand))
        msg.user = obj.user.id
        msg.channel = obj.channel.id
        msg.attachments[0].actions[0].options = arr
        msg.attachments[0].actions[0].options[arr.length] = {value : "new_command", text : "Novo comando"}
        webClient.chat.postMessage(msg)
    })
}

handleEditCommand = obj => {
    if(obj.submission.edit_delete == "edit"){
        
        let query = {}
        if(obj.submission.command_name != null){
            if(obj.submission.command_name.charAt(0) != "!"){
                webClient.chat.postMessage({channel : obj.channel.id, text : 'Falha. Por favor ponha o "!" na frente do nome do comando.'})
                return;
            }
            query.command = obj.submission.command_name
        }
        if(obj.submission.command_return != null){
            query.info = obj.submission.command_return
        }
        commands.updateOne({command : obj.submission.current_command_name}, query).then(() => console.log("Command Updated successfully"))
    }else if(obj.submission.edit_delete == "delete"){
        commands.deleteOne({command : obj.submission.current_command_name}).then(() => console.log("Command Deleted successfully"))
    }else{
        console.log("Some shit happend")
    }
}

handleNewCommand = obj => {
    if(obj.submission.command_name.charAt(0) != "!"){
        webClient.chat.postMessage({channel : obj.channel.id, text : 'Falha. Por favor ponha o "!" na frente do nome do comando.'})
        return;
    }
    new commands({
        command : obj.submission.command_name,
        info : obj.submission.command_return
    }).save().then(() => console.log("Command Saved successfully"))
}

//ATUA SOBRE KEYWORDS
handleKeyWord = obj => {
    keywords.find().then(( res )  => {
        let arr = res.map((keyword)=> {return {value : keyword.key, text : keyword.key}})
        let msg = JSON.parse(JSON.stringify(msgs.selectKeyword))
        msg.user = obj.user.id
        msg.channel = obj.channel.id
        msg.attachments[0].actions[0].options = arr
        msg.attachments[0].actions[0].options[arr.length] = {value : "new_keyword", text : "Nova keyword"}
        webClient.chat.postMessage(msg)
    })
}

handleKeywordChoice = obj => {
    if(obj.actions[0].selected_options[0].value != "new_keyword"){
        let msg = JSON.parse(JSON.stringify(msgs.editKeyword))
        msg.trigger_id = obj.trigger_id
        msg.dialog.elements[0].placeholder = obj.actions[0].selected_options[0].value
        webClient.dialog.open(msg).catch(err => {
            console.log(err.data.response_metadata.messages)
        })
    }else{
        let msg = JSON.parse(JSON.stringify(msgs.newKeyword))
        msg.trigger_id = obj.trigger_id
        webClient.dialog.open(msg).catch(err => {
            console.log(err.data.response_metadata.messages)
        })
    }
}

handleEditKeyword = obj => {
    if(obj.submission.edit_delete == "edit"){
        
        let query = {}
        if(obj.submission.keyword_name != null){

            query.key = obj.submission.keyword_name
        }
        if(obj.submission.link != null){
            query.link = obj.submission.link
        }
        keywords.updateOne({key : obj.submission.current_keyword_name}, query).then(() => console.log("KeyWord Updated successfully"))
    }else if(obj.submission.edit_delete == "delete"){
        keywords.deleteOne({key : obj.submission.current_keyword_name}).then(() => console.log("Keyword Deleted successfully"))
    }else{
        console.log("Some shit happend")
    }
}

handleNewKeyword = obj => {
    new keywords({
        key : obj.submission.keyword_name,
        link : obj.submission.link
    }).save().then(() => console.log("Keyword Saved successfully"))
}

//ATUAL SOBRE DUVIDAS

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
    "edit_doubt" : handleEditChoice,
    "command_selection" : handleCommandChoice,
    "edit_command" : handleEditCommand,
    "new_command" : handleNewCommand,
    "keyword_selection": handleKeywordChoice,
    "edit_keyword": handleEditKeyword,
    "new_keyword": handleNewKeyword
}
