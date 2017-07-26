'use strict';

const GitHubApiClient = require("./src/GitHubApiClient");
const _ = require('lodash');

const client = new GitHubApiClient();

const members = process.env.MEMBERS.split(',');
const owner   = process.env.REPOSITORY_OWNER;

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

function formatPullRequest(pr) {
  return `- [ ] ${pr.user.login} ${pr.html_url} ${pr.title}`
}

async function getPullRequests(client, members) {
  const prs = await Promise.all(members.map(client.getPullRequests));
  return _(prs).flatMap((prs) => prs.data.items)
    .reject(isIgnorable)
    .filter(belongsUser)
    .map(formatPullRequest)
    .value()
}

getPullRequests(client, members).then((result) => {
  console.log(result.join("\n"))
})
