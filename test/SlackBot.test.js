const SlackBot = require('../src/SlackBot')
const botkit = require('botkit')

jest.mock('botkit')

beforeEach(() => {
  process.env.SLACK_BOT_TOKEN = 'no diggity'
})

afterEach(() => {
  delete process.env.SLACK_BOT_TOKEN
})

test('.getController() returns a botkit controller instance', () => {
  const controllerMock = {
    spawn: jest.fn(() => {
      return { startRTM: jest.fn().mockReturnThis() }
    }),
  }

  botkit.slackbot.mockReturnValueOnce(controllerMock)

  expect(new SlackBot().getController()).toEqual(controllerMock)
})
