import fetch from "node-fetch";
import amqp from 'amqplib/callback_api';

const TWITCH_URL = process.env.TWITCH_URL || "";
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || "";
const MQ_HOST = process.env.MQ_HOST || "";
const MQ_PORT = process.env.MQ_PORT || "";
const MQ_USERNAME = process.env.MQ_USERNAME || "";
const MQ_PASSWORD = process.env.MQ_PASSWORD || "";
const MQ_CHANNEL = process.env.MQ_CHANNEL || "";

// Init RabbitMQ Channel
let ch: amqp.Channel;
amqp.connect(`amqp://${MQ_USERNAME}:${MQ_PASSWORD}@${MQ_HOST}:${MQ_PORT}`, function (err, conn) {
  conn.createChannel(function (err, channel) {
      
      channel.assertQueue(MQ_CHANNEL, {
        durable: false
      });

      ch = channel;

      main()
      .then(() => console.log("Successful adding twitch rows"))
      .catch(err => console.error(err));
  });
});


// Get top 100 games played on twitch
// According to the official documentation of twitch,
// it is impossible to recover more than 100 occurence.
// https://dev.twitch.tv/docs/v5/reference/games/
const main = async () => {
  const response = await fetch(TWITCH_URL + "?limit=100", {
    method: "GET",
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      Accept: "application/vnd.twitchtv.v5+json"
    }
  });

  if (!response.ok) {
    throw response;
  }

  const result = await response.json();

  // Prepare payload 
  var payLoad = [] as any[];
  var dateInNanoSecond = Date.now()*1000000;
  result.top.map((element: any) => {
    payLoad.push({game: element.game.name, viewerCount: element.viewers, timestamp: dateInNanoSecond});
  });
  
  // Send message to rabbitMQ
  ch.sendToQueue(MQ_CHANNEL, Buffer.from(JSON.stringify({points: payLoad})));
};

// Get twitch game data each minute
setInterval(() => {
  main()
    .then(() => console.log("Successful sending twitch rows"))
    .catch(err => console.error(err));
}, 60 * 1000);
