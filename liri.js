require("dotenv").config();
var keys = require("./keys");
var fs = require("fs");
var Spotify = require("node-spotify-api");

var request = require("request");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);

const action = process.argv[2];
const otherAction = process.argv[3];

switch (action) {
  case ('concert-this'):
      getBands();
  break;
  case ('spotify-this-song'):
      if(otherAction){
          getSpotifysong(otherAction);
       } else{
          getSpotifysong("What's my age again");
       }
  break;
  case ('movie-this'):
      if(otherAction){
          getOmdbdata(otherAction);
      } else{
          getOmdbdata("Mr.Nobody");
      }
  break;
  case ('do-what-it-says'):
       doThething();
  break;
  default:
      console.log('Try again');
    }

//Spotify
function getSpotifysong(song){
  spotify.search({ type: 'track', query: song, limit: 1}, function(error, data){
      if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
          var songData = data.tracks.items[i];
          console.log("Artist: " + songData.artists[0].name);
          console.log("Song: " + songData.name);
          console.log("Preview song: " + songData.preview_url);
          console.log("Album: " + songData.album.name);
          console.log("-----------------------");
          } 
      } else {
      console.log("Error occurred.");
      }
  });
  }

  //OMDB
  function getOmdbdata(movie){
    var omdbAPI = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&apikey=trilogy";
    request(omdbAPI, function (error, response, body){
      if(!error && response.statusCode == 200){
        var body = JSON.parse(body);
  
        console.log("Title: " + body.Title);
        console.log("Release Year: " + body.Year);
        console.log("IMdB Rating: " + body.imdbRating);
        console.log("Country: " + body.Country);
        console.log("Language: " + body.Language);
        console.log("Plot: " + body.Plot);
        console.log("Actors: " + body.Actors);
        console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
        console.log("Rotten Tomatoes URL: " + body.tomatoURL);
        
      }
    });
  
  }
//Bands in town
function getBands(artist){
  var bandsAPI = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  request(bandsAPI, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);
      for(var i = 0; i < body.length; i++){
        var band = body[i];
        console.log(band.venue.city +"," +
            (band.venue.region + band.venue.country) + " at " + band.venue.name + " " + moment(band.datetime).format("MM/DD/YYYY")
            );
        console.log("-----------------------");
        } 
    } else {
    console.log("Error occurred.");
    }
  }
)};
//Do what it says

function doThething(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    getSpotifysong(txt[1]);
  });
}
