FROM node:16.5-alpine

LABEL "com.example.vendor"="Eric Singer"
LABEL version="1.0"
LABEL description="JCS Tab Tracker"

ADD . /config
WORKDIR /config

RUN crontab scripts/firebase

# Install NPM packages then build the site
RUN npm i
RUN npm run build

# Install OpenJDK-11
RUN apk add openjdk11 --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

# Install firebase-tools
RUN npm i -g firebase-tools

EXPOSE  4400 4500 5000 5001 8001 8080 8085 9000
HEALTHCHECK --start-period=1ms CMD curl --fail http://localhost:8080 || exit 1

CMD ["crond","-f", "-L", "/dev/stdout"]