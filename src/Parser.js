'use strict';

const _ = require('lodash')

class Parser {
  constructor(args) {
    this.args = args;
  }

  parse() {
    return {
      authors: _.compact(this.extract('author').split(',')),
      owner: this.extract('owner'),
    }
  }

  extract(argName) {
    const regexp = new RegExp(`${argName}:([A-z0-9\-,]+)`);
    const matched = this.args.match(regexp);

    if (matched) {
      return _.trim(matched[1]);
    } else {
      return '';
    }
  }
}

module.exports = Parser;
