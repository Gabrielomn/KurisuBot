const secrets = require('./secrets')
const SlackBot = require('slackbots')
const {WebClient} = require('@slack/client')
const slackWeb = new WebClient(secrets.oAuth)
const createrSlackEvents = require('@slack/events-api') 
const slackEvents = createrSlackEvents.createEventAdapter(secrets.oAuth)
const {createMessageAdapter} = require('@slack/interactive-messages')
const slackInteractions = createMessageAdapter(secrets.oAuth)
const bot = new SlackBot({
    token: secrets.token,
    name: 'KyoumaBot'
})

module.exports = {
    bot,
    slackEvents,
    slackInteractions,
    slackWeb
}