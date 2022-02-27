FROM node:16.13.2

WORKDIR /app

COPY . .

RUN npm ci

ENV PORT 3000
EXPOSE 3000

CMD npm run start