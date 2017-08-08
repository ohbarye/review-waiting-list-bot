'use strict';

const GitHubApi = require("github");
const _ = require("lodash");

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

    _.bindAll(this, ['getPullRequestsForAuthor', 'getTeamMembers', 'isTeam', 'getAllPullRequests', 'getPullRequestsForTeamOrAuthor']);
  }

  getPullRequestsForAuthor(author) {
    return this.github.search.issues({q: `type:pr+state:open+author:${author}`});
  }

  async getTeamMembers(teamNameWithOrg) {
    const [orgName, teamSlug] = teamNameWithOrg.split('/');
    const teams = await this.github.orgs.getTeams({org: orgName, per_page: 100});
    const team = _.find(teams.data, { slug: teamSlug });

    const teamMembers = await this.github.orgs.getTeamMembers({id: team.id});
    return teamMembers.data.map((member) => member.login);
  }

  async getPullRequestsForTeamOrAuthor(author) {
    if (this.isTeam(author)) {
      const teamMembers = await this.getTeamMembers(author);
      return Promise.all(_.flatMap(teamMembers, this.getPullRequestsForAuthor));
    } else {
      return this.getPullRequestsForAuthor(author);
    }
  }

  async getAllPullRequests(authors) {
    const prs = await Promise.all(authors.value.map(this.getPullRequestsForTeamOrAuthor));
    return _.flattenDeep(prs);
  }

  isTeam(author) {
    return !!author.match(/^.+\/.+$/);
  }
}

module.exports = GitHubApiClient;
