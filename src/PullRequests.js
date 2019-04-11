'use strict'

const _ = require('lodash')

class PullRequests {
  constructor(prs, {label, reviewer}) {
    this.prs = prs
    this.label = label
    this.reviewer = reviewer
    _.bindAll(this, ['matchesLabel', 'matchesReviewer', 'formatPullRequest', 'reviewersText'])
  }

  isIgnorable(pr) {
    const wordsToIgnore = ['wip', 'dontmerge', 'donotmerge']
    const regexToIgnore = new RegExp(`(${wordsToIgnore.join('|')})`, 'i')

    if (pr.labels != null && pr.labels.nodes.length > 0) {
      const sanitizedLabels = _.flatMap(pr.labels.nodes, (label) => label.name.replace(/'|\s+/g, ''))

      if (_.some(sanitizedLabels, (sanitizedLabel) => sanitizedLabel.match(regexToIgnore))) {
        return true
      }
    }

    const sanitizedTitle = pr.title.replace(/'|\s+/g, '')
    return !!sanitizedTitle.match(regexToIgnore)
  }

  matchesLabel(pr) {
    if (this.label.values.length > 0) {
      const result = _.some(this.label.values, (_label) => {
        return _.flatMap(pr.labels.nodes, (label) => label.name).includes(_label)
      })
      return (this.label.inclusion ? result : !result)
    } else {
      return true
    }
  }

  matchesReviewer(pr) {
    if (this.reviewer.values.length > 0) {
      const result = _.some(this.reviewer.values, (_reviewer) => {
        // Reviewer could be a user or a team
        const matched = _reviewer.match(/^.+\/(.+)$/)
        const usernameOrTeamName = matched ? matched[1] : _reviewer

        return _.flatMap(pr.reviewRequests.nodes, (request) => {
          return request.requestedReviewer.login || request.requestedReviewer.name
        }).includes(usernameOrTeamName)
      })
      return (this.reviewer.inclusion ? result : !result)
    } else {
      return true
    }
  }

  formatPullRequest(pr, index) {
    return `${index+1}. \`${pr.title.replace('DBL-', 'DBL・')}\` ${pr.url} by ${pr.author.login} ${this.reviewersText(pr.reviewRequests.nodes)}`
  }

  reviewersText(reviewRequests) {
    const reviewers = _.map(reviewRequests, rr => (rr.requestedReviewer.login || rr.requestedReviewer.name))
    return reviewers.length > 0 ? `(reviewer: ${reviewers.join(', ')})` : '(no reviewer assigned)'
  }

  convertToSlackMessages() {
    return _(this.prs)
      .reject(this.isIgnorable)
      .filter(this.matchesLabel)
      .filter(this.matchesReviewer)
      .map(this.formatPullRequest)
      .value()
  }
}

module.exports = PullRequests
