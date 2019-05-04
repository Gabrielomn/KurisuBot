let bot = require('./config.js').bot
const handlers = require('./handlers.js')
const express = require('express')
const app = express()
const PORT = 8080

app.listen(PORT, () =>{
    console.log('Server is listening on port: ' + PORT)
})
//============================================== STATUS ==============================================

app.post('/slack/interact', (req, res) => {
    
})

bot.on('start', () =>{

    bot.postMessageToChannel('general', 
    'Im ready guysss')
    setInterval(()=>{
      //tools.update()
    }, 10000)
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
            handlers.handleMessage(data)
        }      
    }
  
})