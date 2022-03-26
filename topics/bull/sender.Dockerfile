FROM node:16.14.2

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE ${PORT}

CMD npm run sender:start