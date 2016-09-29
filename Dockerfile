FROM mhart/alpine-node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY . /usr/src/app

EXPOSE 9091
CMD [ "npm", "start" ]
