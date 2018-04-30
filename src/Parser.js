'use strict'

const _ = require('lodash')
const Condition = require('./Condition')

class Parser {
  constructor(args) {
    this.args = args
  }

  parse() {
    return Condition.ACCEPTABLE_CONDITIONS.reduce((obj, key) => {
      return {
        ...obj,
        [key]: this.extract(key),
      }
    }, {})
  }

  extract(argName) {
    const keyName = argName === 'user' ? 'owner' : argName // TODO this is Workaround to convert
    const regexp = new RegExp(`-?${keyName}:([A-z0-9-,/]+)`)
    const matched = this.args.match(regexp)
    return new Condition(argName, ...this.convertToConditionArgs(matched))
  }

  convertToConditionArgs(matched) {
    return matched ? [
                       _.compact(_.trim(matched[1]).split(',')),
                      !_.startsWith(matched[0], '-'),
                     ]
                     : []
  }
}

module.exports = Parser
