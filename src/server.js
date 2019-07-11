const dotenv = require('dotenv').config()
let bot = require('./config.js').bot
const handlers = require('./handlers.js')
const bodyParser = require('body-parser')
const express = require('express')
const tools = require('./tools.js')
const stats = require('./stats')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 8080
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use(express.json(), function (req, res, next) {
    res.header("Allow", "OPTIONS, GET, POST")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.header("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()

})
app.listen(PORT, () =>{
    console.log('Server is listening on port: ' + PORT)
})
//============================================== STATUS ==============================================

app.post('/slack/interact', (req, res) => {
    handlers.handleInteraction(req.body)
    console.log('interaction handled')
    let obj = JSON.parse(req.body.payload)
    if(obj.callback_id == "command_selection"){
        res.sendStatus(200)
    }
    res.send()
})

app.get('/stats', async (req, res) => {
    let data = await stats.getStats()
    res.status(200).send(saida = {
        data
    })
})

bot.on('start', async () =>{

    await handlers.handleConfiguration()

    bot.postMessageToChannel('general', 
    'Im ready guysss')

    setInterval(()=>{
      tools.update()
    }, 1 * 60 * 60 * 1000)
})

    //Error Handler
bot.on('error', (err) => console.log(err));


//Message Handler
bot.on('message', (data) => {
    
    if(data.type !== 'message'){
        return;
    }
   
    if(data.user != bot.user){
        if(data.thread_ts){
            handlers.handleReply(data)
        }else{
            console.log(data)
            handlers.handleMessage(data)
        }      
    }
  
})