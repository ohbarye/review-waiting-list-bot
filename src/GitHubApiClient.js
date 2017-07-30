'use strict';

const GitHubApi = require("github");

class GitHubApiClient {
  constructor() {
    this.github = new GitHubApi({
      debug: !!process.env.DEBUG,
      timeout: 5000
    });

    const AUTH_TOKEN = process.env.GITHUB_AUTH_TOKEN;

    if (AUTH_TOKEN) {
      this.github.authenticate({type: "oauth", token: AUTH_TOKEN});
    }

    this.getPullRequests = this.getPullRequests.bind(this);
    this.getAllPullRequests = this.getAllPullRequests.bind(this);
  }

  getPullRequests(author) {
    return this.github.search.issues({q: `type:pr+state:open+author:${author}`});
  }

  async getAllPullRequests(authors) {
    return await Promise.all(authors.map(this.getPullRequests));
  }

  isTeam(author) {
    !!author.match(/^.+\/.+$/)
  }
}

module.exports = GitHubApiClient;
