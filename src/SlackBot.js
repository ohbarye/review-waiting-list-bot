'use strict';

const Botkit = require('botkit');

class SlackBot {
  constructor() {
    const slackBotToken = process.env.SLACK_BOT_TOKEN;

    if (!slackBotToken) {
      console.log('Error: Specify token in environment');
      process.exit(1);
    }

    this.controller = Botkit.slackbot({
      debug: !!process.env.DEBUG
    });

    this.controller.spawn({
      token: slackBotToken
    }).startRTM((err, bot, payload) => {
      if (err) {
        throw new Error('Could not connect to Slack');
      }
    });
  }

  getController() {
    return this.controller
  }
}

module.exports = SlackBot;
