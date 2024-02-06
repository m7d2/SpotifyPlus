const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 2000;

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
];



const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URL
});

app.set('port', port);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
res.send("Hello");
    
});

app.get("/login", (req, res) => {
    
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
})

app.get("/callback", (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;


    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }
    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];

            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);

            console.log(
                `Sucessfully retreived access token. Expires in ${expires_in} s.`
            );

          

            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];

                console.log('The access token has been refreshed!');
                console.log('access_token:', access_token);
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);

            // setTimeout(() => {
            //     res.redirect(`http://localhost:2000/home?code=${code}`);
            // }, 1000);

        })
        .catch(error => {
            console.error('Error getting Tokens:', error);
            res.send(`Error getting Tokens: ${error}`);
        });
});

app.get("/toptracks", async (req, res) => {
    
    spotifyApi.clientCredentialsGrant().
        then(function (res) {
            console.log('It worked! Your access token is: ' + res.body.access_token);
        }).catch(function (err) {
            console.log('If this is printed, it probably means that you used invalid ' +
                'clientId and clientSecret values. Please check!');
            console.log('Hint: ');
            console.log(err);
        });

    const topTracks = await spotifyApi.getMyTopTracks();
    let tracks = [];
    let temp;
   for ( let i = 0; i < topTracks.body.items.length; i++){
        tracks.push(topTracks.body.items[i]);
        temp += `<div><h1>${topTracks.body.items[i].album.name}</h1><p>${topTracks.body.items[i].album.artists[0].name}</p>
                        <audio class="audioPrev" controls>
                            <source src="${topTracks.body.items[i].preview_url}" type="audio/mpeg">
                        </audio><br>
                        <img src="${topTracks.body.items[i].album.images[1].url}"></img>
                </div>`;
       console.log(topTracks.body.items[i].album.images[0].url);
   }
    
//    res.json(tracks);
   res.send(`${temp}`);
});


app.get("/api", (req, res) => {

    res.json("test")
})

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});