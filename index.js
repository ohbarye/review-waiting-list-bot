'use strict';

const SlackBot = require('./src/SlackBot');
const GitHubApiClient = require("./src/GitHubApiClient");
const _ = require('lodash');

const controller = new SlackBot().getController()

controller.hears("^ls author:([^\s]+) owner:([^\s]+)",["direct_message","direct_mention","mention"], (bot, message) => {
  const authors = message.match[1].split(',');
  const owner = message.match[2];

  const client = new GitHubApiClient();

  function isIgnorable(pr) {
    const ignoreWords = ['wip', 'dont merge', 'dontmerge', 'donotmerge'];
    const regex = new RegExp(`(${ignoreWords.join('|')})`, 'i');
    return !!pr.title.match(regex)
  }

  function belongsToOwner(pr) {
    if (owner) {
      return pr.html_url.match('^https://github.com/([^/]+)/')[1] == owner
    } else {
      return true
    }
  }

  function formatPullRequest(pr, index) {
    return `${index+1}. \`${pr.title}\` ${pr.html_url} by ${pr.user.login} `
  }

  function postReviewWaitingList(client, authors) {
    client.getAllPullRequests(authors).then((prs) => {
      const formettedPRs = _(prs).flatMap((prs) => prs.data.items)
        .reject(isIgnorable)
        .filter(belongsToOwner)
        .map(formatPullRequest)
        .value();

      bot.startConversation(message, (err, convo) => {
        convo.say(':memo: Review waiting list!');
        _.each(formettedPRs, (pr, index) => convo.say(pr));
        convo.next()
      })
    });
  }

  postReviewWaitingList(client, authors);
  // getPullRequests(client, authors).then((result) => {
  //   bot.startConversation(message, (err, convo) => {
  //     convo.say(':memo: Review waiting list!');
  //     _.each(result, (pr, index) => convo.say(formatPullRequest(pr, index+1)));
  //     convo.next()
  //   })
  // })
});
