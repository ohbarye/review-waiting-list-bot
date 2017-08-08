# Let's encourage your team's review

## What's this?

It's a Slack bot to list up review waiting list.


## Usage

In your Slack room, just call your bot.

```
/invite @review-bot
@review-bot ls author:ohbarye,basan,org/team owner:ohbarye repo:ohbarye/review-waiting-list-bot,rails/rails
```

argument | presence | description
--- | --- | ---
author | Required | You can specify multiple authors with comma separated values. Also `org/team` is available.
owner | Optional | It allows only one owner. If you specify this argument with `-` (e.g. `-owner:ohbarye`), it excludes pull requests of the owner.
repo | Optional | You can specify multiple repositories. If you specify this argument with `-` (e.g. `-repo:ohbarye/review-waiting-list-bot`), it excludes pull requests in the repositories.

Besides, the bot accepts random order.

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
