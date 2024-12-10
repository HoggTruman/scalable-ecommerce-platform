ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app

COPY . .

RUN npm install \
    && npm install typescript@5.6.3 -g \
    && tsc
    



FROM node:${NODE_VERSION}-alpine AS final
WORKDIR /usr/src/app

COPY --from=builder ./app/dist/src ./dist/src
COPY package.json ./

ENV NODE_ENV production

RUN npm install

EXPOSE 9001

CMD npm start