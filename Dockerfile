# create a file named Dockerfile
FROM node:7-alpine

RUN apk add --no-cache git nano curl && mkdir /api

WORKDIR /api

RUN npm install pm2  webpack -g \
  && npm install

EXPOSE 80

CMD ["pm2-docker", "process.json"]
