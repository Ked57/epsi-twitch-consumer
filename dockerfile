FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV TWITCH_URL TWITCH_CLIENT_ID MQ_HOST MQ_PORT MQ_USERNAME MQ_PASSWORD MQ_CHANNEL

ENTRYPOINT [ "npm", "start" ]