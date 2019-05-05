const msgs = require('./jsonMessages')
const tools = require('./tools')
const webClient = require('./config').slackWeb
const keywords = require('../models/KeyWord')

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

handleAlunoChoice = (obj) => {
    if(obj.actions[0].name === "open_doubt"){
        handleOpenDoubt(obj)
    }else if(obj.actions[0].name === "edit_doubt"){

    }
}

handleNewDoubtDialog = (obj) =>{
    tools.saveDoubt(obj.action_ts, obj.submission.doubt_category, obj.submission.doubt_body)
    console.log(obj)
}

module.exports = {
    "aluno_choice" : handleAlunoChoice,
    "open_doubt_dialog" : handleNewDoubtDialog
}