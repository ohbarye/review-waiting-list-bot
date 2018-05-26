const Parser = require('../src/Parser')
const Condition = require('../src/Condition')

test('.parse() works with simple arguments', () => {
  const parser = new Parser("author:cat owner:host repo:pethouse label:meow -reviewer:dog")
  expect(parser.parse()).toEqual({
    author: new Condition('author', ['cat'], true),
    user: new Condition('user', ['host'], true),
    repo: new Condition('repo', ['pethouse'], true),
    label: new Condition('label', ['meow'], true),
    reviewer: new Condition('reviewer', ['dog'], false),
  })
})

test('.parse() works even when arguments have quotations', () => {
  const parser = new Parser(`author:cat owner:'host' repo:"pethouse/watchdog" label:"good first","bug" -reviewer:“dog”`)
  expect(parser.parse()).toEqual({
    author: new Condition('author', ['cat'], true),
    user: new Condition('user', ['host'], true),
    repo: new Condition('repo', ['pethouse/watchdog'], true),
    label: new Condition('label', ['good first', 'bug'], true),
    reviewer: new Condition('reviewer', ['dog'], false),
  })
})
