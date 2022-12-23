FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

RUN apk add --update --no-cache openssl1.1-compat

RUN npm install

COPY . .

RUN npm run generateprisma

RUN npm run build

CMD node dist/index.js