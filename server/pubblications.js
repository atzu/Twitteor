Meteor.publish('tweets', function(){
       return Tweets.find({ user_id: this.userId }, {sort: {"creationDate": -1}, limit: 20});
   });

Meteor.publish('geotweets', function(){
       return GeoTweets.find({ user_id: this.userId }, {sort: {"creationDate": -1}, limit: 20});
   });

Meteor.publish('trends', function(){
       return Trends.find({ user_id: this.userId });
   });
