ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production


WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
 
COPY . .

RUN tsc

EXPOSE 9001

CMD node ./dist/index.js