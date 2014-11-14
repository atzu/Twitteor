 var stream_array=new Array();

//Stream Aux methods
createStream = function (user_id){
    Streams.insert({user_id: user_id}); //In database
    stream_array[user_id]=stream; //In memory
}

stopStream = function(user_id){
    if (Streams.findOne({user_id : user_id})){
               console.log('found users stream');
               stream=stream_array[user_id];
               stream.stop();
               console.log('stopped');
            }
}

removeStream = function(user_id){
    delete stream_array[user_id];
    Streams.remove({user_id : user_id});
}

cleanTweets = function(user_id){
    Tweets.remove({ user_id: user_id });
}

cleanGeoTweets = function(user_id){
    GeoTweets.remove({ user_id: user_id });
}

  // server code: clean up dead clients after 60 seconds
Meteor.setInterval(function () {
  var now = (new Date()).getTime();
  Connections.find({last_seen: {$lt: (now - 60 * 1000)}}).forEach(function (user) {
    // do something here for each idle user
  });
});
