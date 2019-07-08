const idChannelGeneral = "CHN2NCVU2"
const idChannelDuvidas = "CHT932M7T"
const bot = require('./config').bot
const channels =[idChannelGeneral, idChannelDuvidas]
const acessToken = require('./secrets').oAuth;
const webClient = require('./config').slackWeb
const doubts = require('./../models/Doubt')
const commands = require('./../models/Command');
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

//METODOS QUE ATUAM SOBRE OS COMANDOS
var getCommand = (text, callback) => {
    commands.findOne({'command' : text}, (err, res) => {
        if(err) callback(err, null)
        if(res != null){
            info = res.info
            callback(null, info)
        }else{
            if(text.charAt(0) === "!"){
                info = "Comando inexistente"
                callback(null, info)
            }
        }
    })
}

var postCommand = (data) => {
    getCommand(data.text, (err, info) => {
        if(err) console.log("erro: " + err)
        else{
            bot.postEphemeral(data.channel, data.user, info)
        }
    })
    
}

var admCommands = ['!addCommand', '!delCommand']

var isCommand = (msg) =>  {
    if(admCommands.includes(msg)){
        return true
    }else{
        return false;
    }
} 

var saveCommand = (msg) => {
    let c = msg.split(" ")

    if(c.length == 2){
        new commands({
            command:c[0],
            info:c[1]
    }).save().then(() => {
        console.log('Novo comando salvo com sucesso')
    }).catch(err => {
        console.log('erro: ' + err)
        })
    }
}

var delCommand = (comando) => {
    commands.deleteOne({'command' : comando},(err, res) => {
        if(err) console.log('Erro ao deletar o comando '+comando + ", erro: " + err)
        console.log("Comando deletado com sucesso")
    })
}

//METODOS QUE ATUAM SOBRE AS DUVIDAS
var saveDoubt = (ts, tema, msg, id) => {
    let date = new Date()
    new doubts ({
        ts: ts,
        topico: tema,
        duvida: msg,
        idUser: id,
        status: false,
        resposta: '',
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
    isCommand,
    saveCommand,
    postCommand,
    isAdmin,
    delCommand,
    update,
    findPendingDoubts,
    closeDoubt
}