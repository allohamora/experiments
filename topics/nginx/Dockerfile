FROM node:16.14.2

WORKDIR /app

COPY src src
COPY package*.json ./

RUN npm ci

CMD npm run start