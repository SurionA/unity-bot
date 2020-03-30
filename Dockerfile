FROM node:12-alpine as build-deps

WORKDIR /srv/scripts

COPY package.json package-lock.json ./
RUN npm i
COPY . ./
RUN npm run bin


FROM  alpine:3.9

LABEL description="Provides a base image for unity bot"
LABEL maintainer="SurionA <frere.maxime@gmail.com>"

WORKDIR /srv/app

COPY --from=build-deps /srv/scripts/bin/unity /srv/scripts/bin/unity

ENV BOT_USERNAME=Unity
ENV BOT_AVATAR_URL=https://raw.githubusercontent.com/SurionA/unity-bot/master/src/assets/unity.jpg
ENV PATH="$PATH:/srv/scripts/bin"
