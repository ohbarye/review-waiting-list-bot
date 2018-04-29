'use strict'

const axios = require("axios")
const _ = require("lodash")

class GitHubApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.github.com/',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_AUTH_TOKEN}`,
      },
    })

    _.bindAll(this, ['getPullRequestsForAuthorQuery', 'getPullRequestsForAuthor', 'getTeamMembersQuery', 'getTeamMembers', 'isTeam', 'getAllPullRequests', 'getPullRequestsForTeamOrAuthor'])
  }

  // This query results below.
  //
  // {
  //   "data": {
  //     "search": {
  //       "nodes": [
  //         {
  //           "title": "Enable to fetch pull requests by specifying assignee",
  //           "url": "https://github.com/ohbarye/review-waiting-list-bot/pull/26",
  //           "author": {
  //             "login": "ohbarye"
  //           },
  //           "labels": {
  //             "nodes": [
  //               {
  //                 "name": "enhancement"
  //               }
  //             ]
  //           },
  //           "reviewRequests": {
  //             "nodes": [
  //               {
  //                 "login": "ohbarye"
  //               },
  //             ]
  //           }
  //         }
  //       ]
  //     }
  //   }
  // }
  getPullRequestsForAuthorQuery(author) {
    // TODO consider pagination
    // TODO consider requestedReviewer is a team
    return `
      query {
        search(first:100, query:"type:pr author:${author} state:open", type: ISSUE) {
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
              reviewRequests(first:100) {
                nodes {
                  requestedReviewer {
                    ... on User {
                      login
                    },
                  }
                }
              },
            }
          },
        }
      }`
  }

  async getPullRequestsForAuthor(author) {
    const query = this.getPullRequestsForAuthorQuery(author)
    const response = await this.client.post('graphql', { query })
    return response.data.data.search.nodes
  }

  // This query results below.
  //
  // {
  //   "data": {
  //     "organization": {
  //       "teams": {
  //         "nodes": [
  //           {
  //             "name": "ok-go",
  //             "members": {
  //               "nodes": [
  //                 {
  //                   "login": "ohbarye"
  //                 }
  //               ]
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   }
  // }
  getTeamMembersQuery(orgName, teamSlug) {
    // TODO consider pagination
    return `
      query {
        organization(login: "${orgName}") {
          teams(first:100, query: "${teamSlug}") {
            nodes {
              name,
              members(first:100) {
                nodes {
                  login
                }
              }
            }
          }
        }
      }`
  }

  async getTeamMembers(teamNameWithOrg) {
    const [orgName, teamSlug] = teamNameWithOrg.split('/')
    const query = this.getTeamMembersQuery(orgName, teamSlug)
    const response = await this.client.post('graphql', { query })
    const team = _.find(response.data.data.organization.teams.nodes, { name: teamSlug })
    return team.members.nodes.map((member) => member.login)
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
