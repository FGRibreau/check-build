FROM node:0.12.1

MAINTAINER Francois-Guillaume Ribreau <fg@iadvize.com>

RUN npm install check-build -g

VOLUME /app
WORKDIR /app

CMD ["check-build"]
