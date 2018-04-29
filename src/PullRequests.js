'use strict'

const _ = require('lodash')

class PullRequests {
  constructor(prs, {owner, repo, label}) {
    this.prs = prs
    this.owner = owner
    this.repo = repo
    this.label = label

    _.bindAll(this, ['belongsToOwner', 'matchesRepo', 'matchesLabel'])
  }

  isIgnorable(pr) {
    const ignoreWords = ['wip', 'dontmerge', 'donotmerge']
    const regex = new RegExp(`(${ignoreWords.join('|')})`, 'i')
    const sanitizedTitle = pr.title.replace(/'|\s+/g, '')
    return !!sanitizedTitle.match(regex)
  }

  belongsToOwner(pr) {
    if (this.owner.value) {
      const result = pr.url.match('^https://github.com/([^/]+)/')[1] === this.owner.value
      return (this.owner.inclusion ? result : !result)
    } else {
      return true
    }
  }

  matchesRepo(pr) {
    if (this.repo.value.length > 0) {
      const result = _.some(this.repo.value, (repo) => {
        return pr.url.match('^https://github.com/([^/]+/[^/]+)/')[1] === repo
      })
      return (this.repo.inclusion ? result : !result)
    } else {
      return true
    }
  }

  matchesLabel(pr) {
    if (this.label.value.length > 0) {
      const result = _.some(this.label.value, (_label) => {
        return _.flatMap(pr.labels.nodes, (label) => label.name).includes(_label)
      })
      return (this.label.inclusion ? result : !result)
    } else {
      return true
    }
  }

  formatPullRequest(pr, index) {
    return `${index+1}. \`${pr.title}\` ${pr.url} by ${pr.author.login}`
  }

  convertToSlackMessages() {
    return _(this.prs)
      .reject(this.isIgnorable)
      .filter(this.belongsToOwner)
      .filter(this.matchesRepo)
      .filter(this.matchesLabel)
      .map(this.formatPullRequest)
      .value()
  }
}

module.exports = PullRequests
