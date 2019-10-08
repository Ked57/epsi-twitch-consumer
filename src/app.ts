import fetch from "node-fetch";

const TWITCH_URL = process.env.TWITCH_URL || "";
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || "";
const API_URL = process.env.API_URL || "";
const API_PATH = process.env.API_PATH || "";
const API_TOKEN = process.env.API_TOKEN || "";

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

  // Wait for all request on the API are done before continuing
  await Promise.all(
    result.top.map((element: any) => {
      saveGameViewerCount(element.game.name, element.viewers).catch(err =>
        console.error(err)
      );
    })
  );
};

// Call an API with game name and viewer count
const saveGameViewerCount = async (gameName: string, viewerCount: string) => {
  const response = await fetch(`${API_URL}/${API_PATH}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({ game: gameName, viewerCount: viewerCount })
  });
  if (!response.ok) {
    throw response;
  }
};

// Get twitch game data each minute
setInterval(() => {
  main()
    .then(() => console.log("Successful adding twitch rows"))
    .catch(err => console.error(err));
}, 60 * 1000);

// Run the process at the beginning
main()
  .then(() => console.log("Successful adding twitch rows"))
  .catch(err => console.error(err));
