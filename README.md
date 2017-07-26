# Let's encourage your team's review

## What's this?

It's a Slack bot to list up review waiting list.


## Usage

```
@review-bot ls author:ohbarye,basan owner:ohbarye
```

- author: Required. You can specify multiple authors with comma separated values.
- owner: Required. It allows only one owner.

## Develop

```sh
$ git clone git@github.com:ohbarye/review-waiting-list-bot.git
$ npm install -g yarn && yarn
$ SLACK_BOT_TOKEN=your-slack-bot-token GITHUB_AUTH_TOKEN=your-github-auth-token node index.js
```

## Deployment

If you want to deploy to Heroku, just click following button.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Environment Variables

### SLACK_BOT_TOKEN (required)

Slack bot API token.

If you do not have it yet, visit https://my.slack.com/services/new/bot and get the token.


### GITHUB_AUTH_TOKEN (required)

GitHub bot API token.
 
If you're not familiar with it, see https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
