FROM node:16.5

RUN npm install -g npm

ADD . /config
WORKDIR /config

RUN echo 'deb http://ftp.debian.org/debian stretch-backports main' | tee /etc/apt/sources.list.d/stretch-backports.list

RUN apt-get update && \
    apt-get install -y openjdk-11-jre-headless git && \
    apt-get clean

RUN npm i && \
    npm i -g firebase-tools
RUN npm audit fix;

RUN firebase --version
RUN npm run build

EXPOSE 4000 4400 4500 5000 5001 8001 8080 8085 9000