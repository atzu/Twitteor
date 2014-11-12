  //Twitter calls
  //Meteor.call("tweets", function(error, results) {
    //console.log(results); //results.data should be a JSON object
  //});

var hashtag;


Meteor.subscribe('tweets');


Template.hashtag.helpers({
    'tweets': function(){
        return Tweets.find({"user_id": Meteor.userId(), "hashtag" : hashtag}, {sort: {"creationDate": -1}});
    }
});

Template.hashtag.events({
	'click #hashButton' : function(){
		var hashtag=$('#hashtag').val();
		var user_id=Meteor.userId();
		Meteor.call('stopStream', user_id, function(e, r) {
			console.log('stop request');
    	});
		Meteor.call('twitsByHashtag', user_id, hashtag , function(e, r) {
			console.log('Hashtag start request');
    	});
    	$('#tag-name').html("Hashtag: "+hashtag);
	},
	'click #stopButton' : function(){
		var user_id=Meteor.userId();
		Meteor.call('stopStream', user_id, function(e, r) {
			console.log('stop request');
    	});
	}
	});

// client code: ping heartbeat every 5 seconds
Meteor.setInterval(function () {
	console.log(Meteor.userId());
  Meteor.call('keepalive', Meteor.userId());
}, 5000);

Template.nav.events({
'click #private': function (event) {
hashtag=document.getElementById('hashtag').value;
var user_id=Meteor.userId();
$('#tag-name').html("Hashtag: "+hashtag);
 Meteor.call('twitsByHashtag', user_id, hashtag, function(e, r) {
      });
},
'click #mapper': function (event) {
	var user_id=Meteor.userId();
	Meteor.call('stopStream', user_id, function(e, r) {
			console.log('stop request');
    	});
	getLocation();
	mapInit();
}
});
