FROM node:16.5

LABEL "com.example.vendor"="Eric Singer"
LABEL version="1.0"
LABEL description="JCS Tab Tracker"

ADD . /config
WORKDIR /config

# Install NPM packages then build the site
RUN npm i
RUN npm run build

# Install OpenJDK-11
RUN echo 'deb http://ftp.debian.org/debian stretch-backports main' | tee /etc/apt/sources.list.d/stretch-backports.list

RUN apt-get update && \
    apt-get install -y openjdk-11-jre-headless cron && \
    apt-get clean;

# Install firebase-tools
RUN npm i -g firebase-tools
RUN firebase --version

# Add cronjob for export
COPY scripts/crontab /etc/cron.d/crontab
 
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/crontab && crontab /etc/cron.d/crontab

# Run the command on container startup
ENTRYPOINT [ "start.sh" ]

EXPOSE  4400 4500 5000 5001 8001 8080 8085 9000
HEALTHCHECK --start-period=1ms CMD curl --fail http://localhost:8080 || exit 1