'use strict';

const Botkit = require('botkit');

const slackBotToken = process.env.SLACK_BOT_TOKEN;

if (!slackBotToken) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

const controller = Botkit.slackbot({
  debug: !!process.env.DEBUG
});

const bot = controller.spawn({
  token: slackBotToken
})

bot.startRTM((err, bot, payload) => {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears("^ls author:([^\s]+) owner:([^\s]+)",["direct_message","direct_mention","mention"], (bot, message) => {
  const authors = message.match[1].split(',');
  const owner = message.match[2]

  const GitHubApiClient = require("./src/GitHubApiClient");
  const _ = require('lodash');

  const client = new GitHubApiClient();

  const ignoreWords = ['wip', 'dont merge', 'dontmerge', 'donotmerge'];

  const regex = new RegExp(`(${ignoreWords.join('|')})`, 'i');

  function isIgnorable(pr) {
    return !!pr.title.match(regex)
  }

  function belongsUser(pr) {
    if (owner) {
      return pr.html_url.match('^https://github.com/([^/]+)/')[1] == owner
    } else {
      return true
    }
  }

  function formatPullRequest(pr, index) {
    return `${index}. \`${pr.title}\` ${pr.html_url} by ${pr.user.login} `
  }

  async function getPullRequests(client, authors) {
    const prs = await Promise.all(authors.map(client.getPullRequests));
    return _(prs).flatMap((prs) => prs.data.items)
      .reject(isIgnorable)
      .filter(belongsUser)
      .value()
  }

  getPullRequests(client, authors).then((result) => {
    bot.startConversation(message, (err, convo) => {
      convo.say(':memo: Review waiting list!');
      _.each(result, (pr, index) => convo.say(formatPullRequest(pr, index+1)));
      convo.next()
    })
  })
});
