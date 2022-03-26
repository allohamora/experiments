FROM node:16.14.2

WORKDIR /app

COPY . .

RUN npm ci

CMD npm run consumer:start