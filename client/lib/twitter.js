  //Twitter calls
  console.log('started');
  //Meteor.call("tweets", function(error, results) {
    //console.log(results); //results.data should be a JSON object
  //});

  Meteor.subscribe("Posts");
