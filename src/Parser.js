'use strict'

const _ = require('lodash')

class Parser {
  constructor(args) {
    this.args = args
    this.argTypes = {
      author: 'multiple',
      assignee: 'multiple',
      owner: 'single',
      repo: 'multiple',
      label: 'multiple',
    }
  }

  parse() {
    return {
      authors: this.extract('author'),
      assignee: this.extract('assignee'),
      owner: this.extract('owner'),
      repo: this.extract('repo'),
      label: this.extract('label'),
    }
  }

  extract(argName) {
    const regexp = new RegExp(`-?${argName}:([A-z0-9-,/]+)`)
    const matched = this.args.match(regexp)
    const type = this.argTypes[argName]

    let condition ={
      value: (type === 'multiple' ? [] : ''),
      inclusion: true,
    }

    if (matched) {
      if (type === 'multiple') {
        condition.value = _.compact(_.trim(matched[1]).split(','))
      } else if (type === 'single') {
        condition.value = _.trim(matched[1])
      }

      condition.inclusion = !_.startsWith(matched[0], '-')
    }

    return condition
  }
}

module.exports = Parser
