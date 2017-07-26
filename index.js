'use strict';

const SlackBot = require('./src/SlackBot');
const GitHubApiClient = require("./src/GitHubApiClient");
const PullRequests = require('./src/PullRequests');
const _ = require('lodash');

const controller = new SlackBot().getController();

controller.hears("^ls author:([^\s]+) owner:([^\s]+)",["direct_message","direct_mention","mention"], (bot, message) => {
  const authors = message.match[1].split(',');
  const owner = message.match[2];

  const client = new GitHubApiClient();

  client.getAllPullRequests(authors).then((prs) => {
    bot.startConversation(message, (err, convo) => {
      convo.say(':memo: Review waiting list!');
      _.each(new PullRequests(prs, owner).convertToSlackMessages(), (pr) => convo.say(pr));
      convo.next()
    })
  });
});
