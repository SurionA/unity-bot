# Unity bot

![Unity](https://raw.githubusercontent.com/SurionA/unity-bot/master/src/assets/unity.jpg)
A gitlab bot for mattermost !

## Build own bot

```docker
# Dockerfile

FROM suriona/unity-bot:latest

ENV MATTERMOST_ACCESS_TOKEN=
ENV MATTERMOST_INCOMING_WEBHOOK_URL=
ENV MATTERMOST_BASE_URL=
ENV GITLAB_URL=
ENV GITLAB_ACCESS_TOKEN=
```

Set your environnement:

| ENV                             | description                                                                                                                |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| MATTERMOST_ACCESS_TOKEN         | Acces token from the mattermost bot account( see [documentation](https://docs.mattermost.com/developer/bot-accounts.html)) |
| MATTERMOST_INCOMING_WEBHOOK_URL | Mattermost incoming webhook url (see [documentation](https://docs.mattermost.com/developer/webhooks-incoming.html))        |
| MATTERMOST_BASE_URL             | Mattermost server url                                                                                                      |
| GITLAB_URL                      | Gitlab server url                                                                                                          |
| GITLAB_ACCESS_TOKEN             | Gitlab access token with api write grant                                                                                   |

## Use in gitlab pipeline

coming soon...
