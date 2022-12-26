FROM node:latest

WORKDIR /app

COPY package.json ./

RUN npm install

RUN apt update && apt install ffmpeg

COPY . .

RUN npm run generateprisma

RUN npm run build

CMD node dist/index.js