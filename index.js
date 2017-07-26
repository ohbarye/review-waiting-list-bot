'use strict';

const GitHubApiClient = require("./src/GitHubApiClient");

const client = new GitHubApiClient();

const members = ['ohbarye'];

async function getPullRequests(client, members) {
  return await Promise.all(members.map(client.getPullRequests))
}

getPullRequests(client, members).then((r) => {
  // TODO format: ress.map((res) => res.data.items...)
  console.log(r)
})
