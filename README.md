# Let's encourage your team's review

[![Build Status](https://travis-ci.org/ohbarye/review-waiting-list-bot.svg?branch=master)](https://travis-ci.org/ohbarye/review-waiting-list-bot)

## What's this?

It's a Slack bot to list up review waiting list.

<img width="1035" alt="2017-08-11 11 15 31" src="https://user-images.githubusercontent.com/1811616/29199753-659fd0e2-7e8a-11e7-8435-99daa8c0b233.png">


## Usage

In your Slack room, just call your bot.

```
/invite @review-bot
@review-bot ls author:ohbarye
```

For more detailed query:

```
/invite @review-bot
@review-bot ls author:ohbarye,basan,org/team owner:ohbarye repo:ohbarye/review-waiting-list-bot,rails/rails
```

argument | presence | description
--- | --- | ---
author | Required | You can specify multiple authors with comma separated values. Also `org/team` is available.
owner | Optional | You can specify multiple owners. If you specify this argument with `-` (e.g. `-owner:ohbarye`), it excludes pull requests of the owner.
repo | Optional | You can specify multiple repositories. If you specify this argument with `-` (e.g. `-repo:ohbarye/review-waiting-list-bot`), it excludes pull requests in the repositories.
label | Optional | You can specify multiple labels. If you specify this argument with `-` (e.g. `-label:enhancement`), it excludes pull requests in the repository.
reviewer | Optional | You can specify multiple reviewers. If you specify this argument with `-` (e.g. `-reviewer:ohbarye`), it excludes pull requests in the repository. Regarding review requests feature on GitHub, see https://blog.github.com/2016-12-07-introducing-review-requests/

Besides, the bot accepts random order.

### Tips

You can use this bot even better in combination with the [Slack reminder](https://get.slack.help/hc/en-us/articles/208423427-Set-a-reminder).

For instance, the following reminder setting invokes the bot every weekday 11 am.

```
/remind #general “@review-bot ls author:ohbarye,basan,org/team owner:ohbarye repo:ohbarye/review-waiting-list-bot,rails/rails” at 11am every weekday
```

## Develop

### Setup

```sh
$ git clone git@github.com:ohbarye/review-waiting-list-bot.git
$ npm install -g yarn # or brew install yarn
$ yarn
```

### Start

```sh
$ SLACK_BOT_TOKEN=your-slack-bot-token GITHUB_AUTH_TOKEN=your-github-auth-token yarn start
```

### Test / Lint

```sh
$ yarn test
$ yarn lint
```

## Environment Variables

### SLACK_BOT_TOKEN (required)

Slack bot API token.

If you do not have it yet, visit https://my.slack.com/services/new/bot and get the token.


### GITHUB_AUTH_TOKEN (required)

GitHub bot API token.
If you're not familiar with it, see https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/

#### Note about scopes of GITHUB_AUTH_TOKEN

You need to grant your token the following required scopes to execute queries from the bot.

- `repo`
- `read:org`
- `read:discussion`

### GITHUB_ORGANIZATION (optional)

GitHub organization name.
Setting this will force the PR's to be scoped to the GitHub organization with that name.

## Deployment

If you want to deploy to Heroku, just click following button.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Run with Docker

Pull the Docker image and run with your Slack bot token and GitHub auth token.

```sh
docker pull ohbarye/review-waiting-list-bot
docker run -e SLACK_BOT_TOKEN=your-slack-bot-token -e GITHUB_AUTH_TOKEN=your-github-auth-token ohbarye/review-waiting-list-bot
```

## Run with Kubernetes

Create a deployment e.g:
```yaml
# deployment.yml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: review-waiting-list-bot
  labels:
    app: review-waiting-list-bot
spec:
  replicas: 1
  selector:
    matchLabels:
      app: review-waiting-list-bot
  template:
    metadata:
      labels:
        app: review-waiting-list-bot
    spec:
      containers:
      - name: review-waiting-list-bot
        image: ohbarye/review-waiting-list-bot
        env:
        - name: GITHUB_AUTH_TOKEN
          valueFrom:
            secretKeyRef:
              key: github-auth-token
              name: review-waiting-list-bot-secrets
        - name: SLACK_BOT_TOKEN
          valueFrom:
            secretKeyRef:
              key: slack-bot-token
              name: review-waiting-list-bot-secrets
        - name: GITHUB_ORGANIZATION
          value: your-github-org
        ports:
        - containerPort: 80
```

Create a secrets file:

```yaml
# secrets.yml
---
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: review-waiting-list-bot-secrets
  namespace: default
data:
  github-auth-token: <insert base64 github-auth-token>
  slack-bot-token: <insert base64 slack-bot-token>
```

Get the base64-encoded values of `GITHUB_AUTH_TOKEN` and `SLACK_BOT_TOKEN`

```sh
echo -n $GITHUB_AUTH_TOKEN | base64
echo -n $SLACK_BOT_TOKEN | base64
```

Store these values in the secrets file.

Create the resources:

```sh
kubectl apply -f secrets.yml
kubectl apply -f deployment.yml
```
