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
  //               {
  //                 "name": "my-team"
  //               },
  //             ]
  //           }
  //         }
  //       ]
  //     }
  //   }
  // }
  getPullRequestsForAuthorsQuery(org, author, repo, user, endCursor) {
    const after = endCursor ? `after:"${endCursor}",` : ''
    return `
      query {
        search(first:100, ${after} query:"type:pr ${org.toQuery()} ${author.toQuery()} ${repo.toQuery()} ${user.toQuery()} state:open", type: ISSUE) {
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
              reviewRequests(first:100) {
                nodes {
                  requestedReviewer {
                    ... on User {
                      login
                    },
                    ... on Team {
                      name
                    },
                  }
                }
              },
            }
          },
        }
      }`
  }

  async getPullRequestsForAuthors(org, author, repo, user) {
    let endCursor = undefined
    let hasNextPage = true
    let nodes = []
    while (hasNextPage) {
      const query = this.getPullRequestsForAuthorsQuery(org, author, repo, user, endCursor)
      const response = await this.client.post('graphql', { query })
      endCursor = response.data.data.search.pageInfo.endCursor
      hasNextPage = response.data.data.search.pageInfo.hasNextPage
      nodes = nodes.concat(response.data.data.search.nodes)
    }
    return nodes
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
    return team ? team.members.nodes.map((member) => member.login): []
  }

  async getAllPullRequests({org, author, repo, user}) {
    author.values = _(await Promise.all(
      author.values.map((author) => {
        return this.isTeam(author) ? this.getTeamMembers(author) : author
      })
    )).flatten()
      .uniq()
      .value()
    const prs = await this.getPullRequestsForAuthors(org, author, repo, user)
    return _.flattenDeep(prs)
  }

  isTeam(author) {
    return !!author.match(/^.+\/.+$/)
  }
}

module.exports = GitHubApiClient
