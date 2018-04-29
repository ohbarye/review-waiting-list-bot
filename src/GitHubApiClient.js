'use strict'

const axios = require("axios")
const octokit = require("@octokit/rest")({
  debug: !!process.env.DEBUG,
  timeout: 5000,
})
const _ = require("lodash")

class GitHubApiClient {
  constructor() {
    this.octokit = octokit
    this.client = axios.create({
      baseURL: 'https://api.github.com/',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_AUTH_TOKEN}`,
      },
    });
    const AUTH_TOKEN = process.env.GITHUB_AUTH_TOKEN

    if (AUTH_TOKEN) {
      this.octokit.authenticate({type: "oauth", token: AUTH_TOKEN})
    }

    _.bindAll(this, ['getPullRequestsForAuthor', 'getTeamMembers', 'isTeam', 'getAllPullRequests', 'getPullRequestsForTeamOrAuthor'])
  }

  async getPullRequestsForAuthor(author) {
    const query = `
      query {
        search(first:100, query:"type:pr author:${author} state:open", type: ISSUE) {
          issueCount,
          pageInfo {
            endCursor,
            hasNextPage,
          },
          nodes {
            ... on PullRequest {
              title,
              url,
              author {
                login,
              },
              labels(first:100) {
                nodes {
                  name,
                },
              },
            }
          },
        }
        }
    `
    const response = await this.client.post('graphql', { query })
    return response.data.data.search.nodes
  }

  async getTeamMembers(teamNameWithOrg) {
    const [orgName, teamSlug] = teamNameWithOrg.split('/')
    const teams = await this.octokit.orgs.getTeams({org: orgName, per_page: 100})
    const team = _.find(teams.data, { slug: teamSlug })

    const teamMembers = await this.octokit.orgs.getTeamMembers({id: team.id})
    return teamMembers.data.map((member) => member.login)
  }

  async getPullRequestsForTeamOrAuthor(author) {
    if (this.isTeam(author)) {
      const teamMembers = await this.getTeamMembers(author)
      return Promise.all(_.flatMap(teamMembers, this.getPullRequestsForAuthor))
    } else {
      return this.getPullRequestsForAuthor(author)
    }
  }

  async getAllPullRequests(authors) {
    const prs = await Promise.all(authors.value.map(this.getPullRequestsForTeamOrAuthor))
    return _.flattenDeep(prs)
  }

  isTeam(author) {
    return !!author.match(/^.+\/.+$/)
  }
}

module.exports = GitHubApiClient
