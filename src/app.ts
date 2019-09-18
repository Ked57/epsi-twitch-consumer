import fetch from "node-fetch";
import https from "https";

fetch('https://api.twitch.tv/kraken/games/top', {
    method: 'GET',
    headers: { 'Client-ID': '?', 'Accept': 'application/vnd.twitchtv.v5+json' },
})
    .then(res => res.json())
    .then(json => {
        json.top.forEach((element: any) => {
            console.log(element.game.name + " (" + element.viewers + " viewers)");
            callApi(element.game.name, element.viewers);
        });
    });

function callApi(gameName: string, viewerCount: string) {
    const options = {
        hostname: 'localhost',
        port: 8080,
        path: '/game',
        method: 'POST',
        body: { game: gameName, viewerCount: viewerCount },
        headers: { 'Content-Type': 'application/json' }
    }
    https.request(options, (response) => {
        if (response.statusCode === 200) {
            console.log("Success")
        } else {
            console.error("Failed")
        }
    }).on('error', (e) => {
        console.error(e);
    });
}