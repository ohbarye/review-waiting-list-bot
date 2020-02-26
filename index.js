const Parser = require('./src/Parser')
const GitHubApiClient = require("./src/GitHubApiClient")
const PullRequests = require('./src/PullRequests')

if (!process.env.GITHUB_AUTH_TOKEN) {
  console.error('Error: GITHUB_AUTH_TOKEN is missing.')
  return
}

const params = process.argv[2]

if (!params) {
  console.error('Error: pull request query parameters are missing.')
  return
}

const conditions = new Parser(params).parse()
const client = new GitHubApiClient()

client.getAllPullRequests(conditions).then((pulls) => {
  console.log('\nPull requests:')
  pulls.forEach(p => console.log(p))

  console.log('\nSlack messages:')
  const messages = new PullRequests(pulls, conditions).convertToSlackMessages()
  messages.forEach(m => console.log(m))

  console.log('\n')
})
