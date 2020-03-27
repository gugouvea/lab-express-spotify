require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get('/', function (req, res) {
    res.render('index')
  })


app.get('/artist-search', function (req, res) {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
        console.log('Search artists by "artist"', data.body);
        // res.send(data)
        let artist = data.body.artists.items;
        res.render('artist-search-results', {
            artist
        })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    })

    app.get('/albums/:artistId', (req, res, next) => {
        spotifyApi
            .getArtistAlbums(req.query.artistId)
            .then(function(data) {
                console.log('Artist albums', data.body);
            }, function(err) {
                console.error(err);
            });
      });

app.get('/albums/:artistId', function (req, res) {
    spotifyApi
        .getArtistAlbums(req.query.artistId)
        .then(data => {
        console.log('Artist albums', data.body);
        // res.send(data)
        let artist = data.body.artists.items;
        
        res.render('artist-search-results', {
            artist
        })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    })



   








// run server
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
