'use strict';

const GitHubApi = require("github");

class GitHubApiClient {
  constructor() {
    this.github = new GitHubApi({
      debug: !!process.env.DEBUG,
      timeout: 5000
    });

    const AUTH_TOKEN = process.env.AUTH_TOKEN;

    if (AUTH_TOKEN) {
      this.github.authenticate({type: "oauth", token: AUTH_TOKEN});
    }

    this.getPullRequests = this.getPullRequests.bind(this)
  }

  getPullRequests(username) {
    return this.github.search.issues({q: `type:pr+state:open+author:${username}`});
  }
}

module.exports = GitHubApiClient;
