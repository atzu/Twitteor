  //Twitter calls
  console.log('started');
  //Meteor.call("tweets", function(error, results) {
    //console.log(results); //results.data should be a JSON object
  //});



Meteor.subscribe('tweets');


Template.private.helpers({
    'tweets': function(){
        return Tweets.find({}, {sort: {"creationDate": -1}});
    }
});

// client code: ping heartbeat every 5 seconds
Meteor.setInterval(function () {
	console.log(Meteor.userId());
  Meteor.call('keepalive', Meteor.userId());
}, 5000);

Template.nav.events({
'click #private': function (event) {
 Meteor.call('twitsByLocation', Meteor.userId(), function(e, r) {
 		console.log('chiamato');
      });
},
'click #home': function (event) {
 Meteor.call('kill', 1, function(e, r) {
 		console.log('killato');
      });
}
});