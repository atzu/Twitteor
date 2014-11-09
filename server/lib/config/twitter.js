 var stream_array=new Array();

 Meteor.publish('tweets', function(){
        return Tweets.find({ user_id: this.userId }, {sort: {"creationDate": -1}, limit: 20});
    });


    Meteor.startup(function () {
    // code to run on server at startup
    var wrappedInsert = Meteor.bindEnvironment(function(tweet, user_id, hashtag) {
    console.log("Tweet inserted for :"+user_id);    
    Tweets.insert({"username": tweet.user.screen_name , "userTweet" : tweet.text, "profilePhoto": tweet.user.profile_image_url, "creationDate" : tweet.created_at, "user_id" : user_id, "hashtag" : hashtag});
  }, "Failed to insert tweet into Posts collection.");
    Connections.remove({});
    Streams.remove({});
    var Twit = Meteor.npmRequire('twit');
    var conf = JSON.parse(Assets.getText('api_keys.json'));
    var T = new Twit({
        consumer_key: conf.consumer_key,
        consumer_secret: conf.consumer_secret,
        access_token: conf.access_token,
        access_token_secret: conf.access_token_secret
    });
   



    //Methods

     Meteor.methods({

      twitsByLocation:  function(user_id){
            console.log(user_id);
            console.log(Connections.findOne({user_id : user_id}));
            if (!Connections.findOne({user_id : user_id})){
                Connections.insert({user_id: user_id});
                console.log('inserito');
                console.log('entrato');
                var Twit = Meteor.npmRequire('twit');
                var conf = JSON.parse(Assets.getText('api_keys.json'));
                var T = new Twit({
                    consumer_key: conf.consumer_key,
                    consumer_secret: conf.consumer_secret,
                    access_token: conf.access_token,
                    access_token_secret: conf.access_token_secret
            });

            var city_area = [  '-122.75', '36.8', '-121.75', '37.8' ]

            stream = T.stream('statuses/filter', { locations: city_area });

            stream.on('tweet', function (tweet, user_id) {
                userName = tweet.user.screen_name;
                userTweet = tweet.text;
                creationDate = tweet.created_at;
                wrappedInsert(tweet, user_id);
                console.log(userName+" says "+userTweet+" at "+ creationDate);

            
            });
        }
        
    },
    twitsByHashtag:  function(user_id, hashtag){
            console.log(user_id);
            console.log(Connections.findOne({user_id : user_id}));
            if (!Connections.findOne({user_id : user_id})){
                Connections.insert({user_id: user_id});
                console.log('inserito');
                console.log('entrato');
                console.log("HashTag: "+hashtag);
            }
            if (hashtag.length==0)
                hashtag='#realmadrid';
            if (!Streams.findOne({user_id : user_id})){
                console.log('not found');
                stream = T.stream('statuses/filter', { track: hashtag });
                createStream(user_id);
            }else{
               console.log('found user\'s stream');
               stopStream(user_id);
               removeStream(user_id);
               stream = T.stream('statuses/filter', { track: hashtag });
               stream.user_id=user_id;
               createStream(user_id);
               console.log('reopened with hash, '+hashtag); 
            }
            stream.on('tweet', function (tweet,hashtag) {
                userName = tweet.user.screen_name;
                userTweet = tweet.text;
                creationDate = tweet.created_at;
                wrappedInsert(tweet, user_id, hashtag);
                console.log("USER_ID: "+stream.user_id+" "+userName+" says "+userTweet+" at "+ creationDate);

            });

        },

         stopStream:  function(user_id){
            console.log("Stop for: "+user_id);
            stopStream(user_id);
            removeStream(user_id);

        },
        

      // server code: heartbeat method

    keepalive: function (user_id) {
    if (Connections.findOne({user_id : user_id})){
        Connections.update(user_id, {$set: {last_seen: (new Date()).getTime()}});
        }
    },
    kill: function (user_id){
        if (Connections.findOne(user_id)){
            Connections.delete({user_id: user_id});
        }
    }



});

});


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

  // server code: clean up dead clients after 60 seconds
Meteor.setInterval(function () {
  var now = (new Date()).getTime();
  Connections.find({last_seen: {$lt: (now - 60 * 1000)}}).forEach(function (user) {
    // do something here for each idle user
  });
}); 

