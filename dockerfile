FROM node:16.5-alpine

COPY . /config
WORKDIR /config

RUN crontab scripts/firebase

RUN apk add openjdk11 --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

RUN npm i -g firebase-tools

EXPOSE  4400 4500 5000 5001 8001 8080 8085 9000
HEALTHCHECK --start-period=1ms CMD curl --fail http://localhost:8080 || exit 1

ENTRYPOINT ["firebase", "emulators:start", "--import=/config/firestore", "--export-on-exit"]