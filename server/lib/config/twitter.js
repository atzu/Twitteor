Posts = new Meteor.Collection('posts');

    Meteor.startup(function () {
    // code to run on server at startup

    var Twit = Meteor.npmRequire('twit');
    var conf = JSON.parse(Assets.getText('api_keys.json'));
    var T = new Twit({
        consumer_key: conf.consumer_key,
        consumer_secret: conf.consumer_secret,
        access_token: conf.access_token,
        access_token_secret: conf.access_token_secret
    });

    sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ];

    stream = T.stream('statuses/filter', { locations: sanFrancisco });

    stream.on('tweet', function (tweet) {
        userName = tweet.user.screen_name;
        userTweet = tweet.text;
        console.log(userName + " says: " + userTweet);
        wrappedInsert(tweet);


    });

    var wrappedInsert = Meteor.bindEnvironment(function(tweet) {
    Posts.insert(tweet);
  }, "Failed to insert tweet into Posts collection."); 
}); 

