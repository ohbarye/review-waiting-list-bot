const PullRequests = require('../src/PullRequests')

test('.isIgnorable(pr) returns true with matched strings', () => {
  const pullRequest = new PullRequests()
  const pullRequests = [
    { title: "Dont merge - this is a PR title" },
    { title: "Don't merge - this is a PR title" },
    { title: "Do not merge - this is a PR title" },
    { title: "[DO NOT MERGE] - this is a PR title" },
    { title: "WIP - this is a PR title" },
  ]

  for (let pr of pullRequests) {
    expect(pullRequest.isIgnorable(pr)).toBeTruthy()
  }
})
