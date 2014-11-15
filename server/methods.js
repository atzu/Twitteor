//Methods

 Meteor.methods({

  twitsByLocation:  function(user_id, location){
        console.log('ricevuto');
        console.log(user_id);
        cleanGeoTweets(user_id);
        console.log(Connections.findOne({user_id : user_id}));
        if (!Streams.findOne({user_id : user_id})){
            console.log('stream not found');
            stream = T.stream('statuses/filter', { locations: location });
            stream.user_id=user_id;
            createStream(user_id);
        }else{
            console.log('found user\'s stream');
            stopStream(user_id);
            removeStream(user_id);
            stream = T.stream('statuses/filter', { locations: location });
            stream.user_id=user_id;
            createStream(user_id);
        }

        stream.on('tweet', function (tweet, city) {
            userName = tweet.user.screen_name;
            userTweet = tweet.text;
            creationDate = tweet.created_at;
            wrappedInsertGeo(tweet, user_id);
            console.log(userName+" says "+userTweet+" at "+ creationDate);


        });

},
twitsByHashtag:  function(user_id, hashtag){
        console.log(user_id);
        cleanTweets(user_id);
        console.log(hashtag);
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
            console.log('stream not found');
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
},
trends: function (place, user_id){
    T.get('trends/place', { id: 1 }, function (err, data, response) {
    console.log(data[0].locations[0].name);
    trends=data[0].trends;
    console.log(data[0].trends[0].name);
    wrappedCleanTrendsForUser(user_id);
    trends.forEach(function(item){
        wrappedInsertTrend(item, user_id);
    });
});
}
// streamTrends: function(user_id){
//         console.log('ricevuto');
//         console.log(user_id);
//         cleanStreams(user_id);
//         stream = T.stream('statuses/filter', { track: hashtag });
//         stream.user_id=user_id;
//         createStream(user_id);


//         stream.on('tweet', function (tweet, city) {
//             userName = tweet.user.screen_name;
//             userTweet = tweet.text;
//             creationDate = tweet.created_at;
//             wrappedInsertGeo(tweet, user_id);
//             console.log(userName+" says "+userTweet+" at "+ creationDate);


//         });
// }



});


