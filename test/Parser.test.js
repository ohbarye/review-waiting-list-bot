const Parser = require('../src/Parser')

test('.parse() works with simple arguments', () => {
  const parser = new Parser("author:cat owner:host repo:pethouse label:meow reviewer:dog")
  expect(parser.parse()).toEqual({
    authors: {
      inclusion: true,
      value: ['cat'],
    },
    owner: {
      inclusion: true,
      value: 'host',
    },
    repo: {
      inclusion: true,
      value: ['pethouse'],
    },
    label: {
      inclusion: true,
      value: ['meow'],
    },
    reviewer: {
      inclusion: true,
      value: ['dog'],
    },
  })
})
