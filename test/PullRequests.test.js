const PullRequests = require('../src/PullRequests')

describe('.isIgnorable', () => {
  test('returns true with matched strings', () => {
    const pullRequest = new PullRequests([], {})
    const pullRequests = [
      { title: "Dont merge - this is a PR title" },
      { title: "Don't merge - this is a PR title" },
      { title: "Do not merge - this is a PR title" },
      { title: "[DO NOT MERGE] - this is a PR title" },
      { title: "WIP - this is a PR title" },
    ]

    for (const pr of pullRequests) {
      expect(pullRequest.isIgnorable(pr)).toEqual(true)
    }
  })
})

describe('.belongsToOwner', () => {
  const pr = { url: "https://github.com/ohbarye/review-waiting-list-bot/pull/34" }

  test('returns true with matched strings', () => {
    const pullRequest =new PullRequests([], {
      owner: {
        value: 'ohbarye',
        inclusion: true,
      },
    })

    expect(pullRequest.belongsToOwner(pr)).toEqual(true)
  })

  test('returns false even with matched strings when inclusion is false', () => {
    const pullRequest =new PullRequests([], {
      owner: {
        value: 'ohbarye',
        inclusion: false,
      },
    })

    expect(pullRequest.belongsToOwner(pr)).toEqual(false)
  })

  test('returns false with unmatched strings', () => {
    const pullRequest =new PullRequests([], {
      owner: {
        value: 'basan',
        inclusion: true,
      },
    })

    expect(pullRequest.belongsToOwner(pr)).toEqual(false)
  })
})

describe('.matchesRepo', () => {
  const pr = { url: "https://github.com/ohbarye/review-waiting-list-bot/pull/34" }

  test('returns true with matched strings', () => {
    const pullRequest =new PullRequests([], {
      repo: {
        value: ['ohbarye/review-waiting-list-bot'],
        inclusion: true,
      },
    })

    expect(pullRequest.matchesRepo(pr)).toEqual(true)
  })

  test('returns false even with matched strings when inclusion is false', () => {
    const pullRequest =new PullRequests([], {
      repo: {
        value: ['ohbarye/review-waiting-list-bot'],
        inclusion: false,
      },
    })

    expect(pullRequest.matchesRepo(pr)).toEqual(false)
  })

  test('returns false with unmatched strings', () => {
    const pullRequest =new PullRequests([], {
      repo: {
        value: ['ohbarye/kpt-bot'],
        inclusion: true,
      },
    })

    expect(pullRequest.matchesRepo(pr)).toEqual(false)
  })
})

describe('.matchesLabel', () => {
  const pr = { labels: { nodes: [{ name: 'enhancement' }] } }

  test('returns true with matched strings', () => {
    const pullRequest =new PullRequests([], {
      label: {
        value: ['enhancement'],
        inclusion: true,
      },
    })

    expect(pullRequest.matchesLabel(pr)).toEqual(true)
  })

  test('returns false even with matched strings when inclusion is false', () => {
    const pullRequest =new PullRequests([], {
      label: {
        value: ['enhancement'],
        inclusion: false,
      },
    })

    expect(pullRequest.matchesLabel(pr)).toEqual(false)
  })

  test('returns false with unmatched strings', () => {
    const pullRequest =new PullRequests([], {
      label: {
        value: ['bug'],
        inclusion: true,
      },
    })

    expect(pullRequest.matchesLabel(pr)).toEqual(false)
  })
})

describe('.formatPullRequest', () => {
  const pr = {
    title: 'Add some tests',
    url: 'https://github.com/ohbarye/review-waiting-list-bot/pull/34',
    author: { login: 'ohbarye' },
  }

  test('returns formatted string', () => {
    const pullRequest = new PullRequests([], {})
    expect(pullRequest.formatPullRequest(pr, 0)).toEqual(
      '1. `Add some tests` https://github.com/ohbarye/review-waiting-list-bot/pull/34 by ohbarye'
    )
  })
})
