import fetch from "node-fetch";

const TWITCH_URL = process.env.TWITCH_URL || "";
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || "";
const API_URL = process.env.API_URL || "";
const API_PATH = process.env.API_PATH || "";

const main = async () => {
  const response = await fetch(TWITCH_URL, {
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

  await Promise.all(
    result.top.map((element: any) => {
      saveGameViewerCount(element.game.name, element.viewers).catch(err =>
        console.error(err)
      );
    })
  );
};

const saveGameViewerCount = async (gameName: string, viewerCount: string) => {
  const response = await fetch(API_URL + API_PATH, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ game: gameName, viewerCount: viewerCount })
  });
  if (!response.ok) {
    throw response;
  }
};

setInterval(() => {
  main()
    .then(() => console.log("Successful adding twitch rows"))
    .catch(err => console.error(err));
}, 60 * 1000);

main()
  .then(() => console.log("Successful adding twitch rows"))
  .catch(err => console.error(err));
