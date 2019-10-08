FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV TWITCH_URL TWITCH_CLIENT_ID API_URL API_PATH

ENTRYPOINT [ "npm", "start" ]