

require("dotenv").config();
var request = require('request');
var keys = require("./keys.js");
var fs = require("fs");
 
var command = process.argv[2];
var input = process.argv[3];

function run(){

    if (command === "my-tweets"){
        tweets();
    }

    else if (command === "spotify-this-song")
    {spotifySong();}
    
    else if (command === "movie-this"){
        movieThis();
    }
    else if(command === "do-what-it-says"){
        doWhat();
    }
    
}run();




function tweets(){

    var Twitter = require('twitter');
 
    var client = new Twitter({
        consumer_key: keys.twitter.consumer_key,
        consumer_secret: keys.twitter.consumer_secret,
        access_token_key: keys.twitter.access_token_key,
        access_token_secret:  keys.twitter.access_token_secret,
       
    });
   
    var params = {screen_name: 'jefeAlias'};
 
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for(var index in tweets){
            console.log(tweets[index].text);
     
            fs.appendFile("log.txt", tweets[index]+ ",", function(err) {
                if (err) {
                  return console.log(err);
                }
              });
        }
     
      }
    });

}

function spotifySong (){

    var Spotify = require('node-spotify-api');
 
        var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret,
        });

        if (input === undefined){
            input = "The Sign Ace of Base";
        }
        
        spotify.search({ type: 'track', query:  input }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var tracks = data.tracks.items;
       var artist = tracks[0].album.artists[0].name;
       var songName = tracks[0].name;
       var link = tracks[0].album.external_urls.spotify; 
       var albumName = tracks[0].album.name;
       console.log('Artist: ' + artist + " Song: " + songName + ' Link: ' + link + ' Album: ' + albumName);
        
    });


}

function movieThis(){
    var movieName = "";

    //if the user doesn't input anything, defaults to Mr. Nobody.
    if (input === undefined){
        movieName = "Mr. Nobody";
    }
    else{
        movieName = input;
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body){

        if (error){
          console.log("you broke it!");
        }
      
        if (!error && response.statusCode === 200) {
      
          var result = JSON.parse(body);
        
          console.log(result.Title);
          console.log(result.Year);
          console.log(result.Rated);
          console.log(result.Country);
          console.log(result.Plot);
          console.log(result.Actors);
        }      
      });
}

function doWhat () {

fs.readFile("random.txt", "utf8", function(error, data) {

    if (error) {
      return console.log(error);
    }
  
    console.log(data);
  
    var dataArr = data.split(",");
  
    for (var index = 0; index < dataArr.length; index++) {
        command = dataArr[0];
        input = dataArr[1];    
    } 

    //run it back through with the new command from txt.
    run();
    });}