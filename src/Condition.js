'use strict'

class Condition {
  constructor(key, values=[], inclusion=true) {
    this.key = key
    this.values = values
    this.inclusion = inclusion
  }

  static get ACCEPTABLE_CONDITIONS() {
    return [
      'author',
      'user',
      'repo',
      'label',
      'reviewer',
      'org',
      'review-requested',
    ]
  }

  toQuery() {
    return this.values
      .map((value) => `${this.inclusion ? '' : '-'}${this.key}:${value}`)
      .join(' ')
  }
}

module.exports = Condition
