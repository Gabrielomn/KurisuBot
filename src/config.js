const secrets = require('./secrets')
const SlackBot = require('slackbots')
const {WebClient} = require('@slack/client')
const slackWeb = new WebClient(process.env.botOAuthToken)
const createrSlackEvents = require('@slack/events-api') 
const slackEvents = createrSlackEvents.createEventAdapter(process.env.botOAuthToken)
const {createMessageAdapter} = require('@slack/interactive-messages')
const slackInteractions = createMessageAdapter(process.env.botOAuthToken)
const bot = new SlackBot({
    token: process.env.botOAuthToken,
    name: 'DaruBot'
})

module.exports = {
    bot,
    slackEvents,
    slackInteractions,
    slackWeb
}