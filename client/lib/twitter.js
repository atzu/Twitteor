  //Twitter calls
  console.log('started');
  //Meteor.call("tweets", function(error, results) {
    //console.log(results); //results.data should be a JSON object
  //});

 Meteor.call('twitsByLocation', 1, function(e, r) {
 		console.log('chiamato');
      });

Meteor.subscribe('tweets');


Template.private.helpers({
    'tweets': function(){
        return Tweets.find({}, {sort: {"creationDate": -1}});
    }
});