'use strict'

const Botkit = require('botkit')

class SlackBot {
  constructor() {
    this.controller = Botkit.slackbot({
      debug: !!process.env.DEBUG,
      stats_optout: true,
      retry: 'Infinity',
    })
    this.controller.spawn({ token: process.env.SLACK_BOT_TOKEN })
      .startRTM((err, _bot, _payload) => {
        if (err) throw new Error('Could not connect to Slack: ' + err)
      })
  }

  getController() {
    return this.controller
  }
}

module.exports = SlackBot
