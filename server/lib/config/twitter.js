 Meteor.publish('tweets', function(){
        return Tweets.find({}, {sort: {"creationDate": -1}, limit: 20});
    });

    Meteor.startup(function () {
    // code to run on server at startup
    var wrappedInsert = Meteor.bindEnvironment(function(tweet) {
    Tweets.insert({"username": tweet.user.screen_name , "userTweet" : tweet.text, "profilePhoto": tweet.user.profile_image_url, "creationDate" : tweet.created_at});
  }, "Failed to insert tweet into Posts collection.");

   



    //Methods

     Meteor.methods({

      twitsByLocation:  function(arg){
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

        stream.on('tweet', function (tweet) {
            userName = tweet.user.screen_name;
            userTweet = tweet.text;
            creationDate = tweet.created_at;
            wrappedInsert(tweet);
            console.log(userName+" says "+userTweet+" at "+ creationDate);

            
        });
        
      }
    });
}); 

