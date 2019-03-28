const Parser = require('../src/Parser')
const Condition = require('../src/Condition')

test('.parse() works with simple arguments', () => {
  const parser = new Parser("author:cat owner:host repo:pethouse label:meow review-requested:horse -reviewer:dog org:acme")
  expect(parser.parse()).toEqual({
    author: new Condition('author', ['cat'], true),
    user: new Condition('user', ['host'], true),
    repo: new Condition('repo', ['pethouse'], true),
    label: new Condition('label', ['meow'], true),
    reviewer: new Condition('reviewer', ['dog'], false),
    org: new Condition('org', ['acme'], true),
    "review-requested": new Condition('review-requested', ['horse'], true),
  })
})

test('.parse() works even when arguments have quotations', () => {
  const parser = new Parser(`author:cat owner:'host' repo:"pethouse/watchdog" review-requested:"horse" label:"good first","bug" -reviewer:“dog” org:"a c m e"`)
  expect(parser.parse()).toEqual({
    author: new Condition('author', ['cat'], true),
    user: new Condition('user', ['host'], true),
    repo: new Condition('repo', ['pethouse/watchdog'], true),
    label: new Condition('label', ['good first', 'bug'], true),
    reviewer: new Condition('reviewer', ['dog'], false),
    org: new Condition('org', ['a c m e'], true),
    "review-requested": new Condition('review-requested', ['horse'], true),
  })
})
