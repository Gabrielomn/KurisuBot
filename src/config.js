const secrets = require('./secrets')
const SlackBot = require('slackbots')
const {WebClient} = require('@slack/client')
const slackWeb = new WebClient(secrets.token)
const createrSlackEvents = require('@slack/events-api') 
const slackEvents = createrSlackEvents.createEventAdapter(secrets.token)
const {createMessageAdapter} = require('@slack/interactive-messages')
const slackInteractions = createMessageAdapter(secrets.token)
const bot = new SlackBot({
    token: secrets.token,
    name: 'KurisuBot'
})

module.exports = {
    bot,
    slackEvents,
    slackInteractions,
    slackWeb
}