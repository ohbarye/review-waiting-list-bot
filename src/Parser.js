'use strict';

const _ = require('lodash')

class Parser {
  constructor(args) {
    this.args = args;
    this.argTypes = {
      author: 'multiple',
      owner: 'single',
      repo: 'multiple',
    };
  }

  parse() {
    return {
      authors: this.extract('author'),
      owner: this.extract('owner'),
      repo: this.extract('repo'),
    }
  }

  extract(argName) {
    const regexp = new RegExp(`${argName}:([A-z0-9\-,\/]+)`);
    const matched = this.args.match(regexp);
    const type = this.argTypes[argName];

    if (matched) {
      if (type === 'multiple') {
        return _.compact(_.trim(matched[1]).split(','));
      } else if (type === 'single') {
        return _.trim(matched[1]);
      }
    } else {
      if (type === 'multiple') {
        return [];
      } else if (type === 'single') {
        return '';
      }
    }
  }
}

module.exports = Parser;
