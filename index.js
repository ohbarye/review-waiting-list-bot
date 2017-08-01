'use strict';

const SlackBot = require('./src/SlackBot');
const GitHubApiClient = require("./src/GitHubApiClient");
const PullRequests = require('./src/PullRequests');
const _ = require('lodash');

const controller = new SlackBot().getController();

controller.hears("ls (.+)",["direct_message","direct_mention","mention"], (bot, message) => {
  const match = message.match[1].match(/author:([A-z0-9\-,]+)[\s]+owner:([A-z0-9\-]+)/);
  const authors = _.compact(_.trim(match[1]).split(','));
  const owner = _.trim(match[2]);

  const client = new GitHubApiClient();

  client.getAllPullRequests(authors).then((prs) => {
    bot.startConversation(message, (err, convo) => {
      convo.say(':memo: Review waiting list!');
      _.each(new PullRequests(prs, owner).convertToSlackMessages(), (pr) => convo.say(pr));
      convo.next()
    })
  });
});
