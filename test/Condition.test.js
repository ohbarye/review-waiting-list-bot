const Condition = require('../src/Condition')

describe('.toQuery', () => {
  test('works with inclusive single arguments', () => {
    const condition = new Condition('author', ['cat'], true)
    expect(condition.toQuery()).toEqual('author:cat')
  })

  test('works with inclusive multiple arguments', () => {
    const condition = new Condition('author', ['cat', 'dog'], true)
    expect(condition.toQuery()).toEqual('author:cat author:dog')
  })

  test('works with exclusive single arguments', () => {
    const condition = new Condition('author', ['cat'], false)
    expect(condition.toQuery()).toEqual('-author:cat')
  })

  test('works with exclusive multiple arguments', () => {
    const condition = new Condition('author', ['cat', 'dog'], false)
    expect(condition.toQuery()).toEqual('-author:cat -author:dog')
  })
})
