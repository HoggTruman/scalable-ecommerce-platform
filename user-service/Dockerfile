ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production


WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install\
    && npm install typescript@5.6.3 -g
 
COPY . .

RUN tsc

EXPOSE 9001

CMD node ./dist/src/index.js