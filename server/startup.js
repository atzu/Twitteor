Meteor.startup(function () {
// code to run on server at startup
    wrappedInsert = Meteor.bindEnvironment(function (tweet, user_id, hashtag) {
        console.log("Tweet inserted for :" + user_id);
        Tweets.insert({
            "username": tweet.user.screen_name,
            "userTweet": tweet.text,
            "profilePhoto": tweet.user.profile_image_url,
            "creationDate": tweet.created_at,
            "user_id": user_id,
            "hashtag": hashtag
        });
    }, "Failed to insert tweet into Tweets collection.");

    wrappedInsertGeo = Meteor.bindEnvironment(function (tweet, user_id, city) {
        console.log("GeoTweet inserted for :" + user_id);
        console.log(tweet.coordinates.coordinates);
        GeoTweets.insert({
            "username": tweet.user.screen_name,
            "userTweet": tweet.text,
            "profilePhoto": tweet.user.profile_image_url,
            "creationDate": tweet.created_at,
            "user_id": user_id,
            "city": city,
            "lat": tweet.coordinates.coordinates[1],
            "lng": tweet.coordinates.coordinates[0]
        });
    }, "Failed to insert tweet into GeoTweets collection.");

    wrappedInsertTrend = Meteor.bindEnvironment(function (trend, user_id, city) {
        console.log("Trend inserted for :" + user_id);
        Trends.insert({
            "name": trend.name,
            "url": trend.url,
            "user_id": user_id
        });
    }, "Failed to insert tweet into Trends collection.");

    wrappedCleanTrendsForUser = Meteor.bindEnvironment(function (user_id) {
        console.log("Cleaning trends for :" + user_id);
        Trends.remove({"user_id" : user_id});
    }, "Failed to insert tweet into Trends collection.");
    Connections.remove({});
    Streams.remove({});
    var Twit = Meteor.npmRequire('twit');
    var conf = JSON.parse(Assets.getText('api_keys.json'));
    T = new Twit({
        consumer_key: conf.consumer_key,
        consumer_secret: conf.consumer_secret,
        access_token: conf.access_token,
        access_token_secret: conf.access_token_secret
    });
});