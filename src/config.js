const SlackBot = require('slackbots')
const secrets = require('./secrets')
const bot = new SlackBot({
    token: secrets.token,
    name: 'KyoumaBot'
})

module.exports = bot