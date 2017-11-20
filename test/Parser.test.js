const Parser = require('../src/Parser')

test('.parse() works with simple arguments', () => {
  const parser = new Parser("author:cat assignee:dog owner:host repo:pethouse label:meow")
  expect(parser.parse()).toEqual({
    authors: {
      inclusion: true,
      value: ['cat'],
    },
    assignee: {
      inclusion: true,
      value: ['dog'],
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
  })
})
