Meteor.subscribe('trends');

Template.home.helpers({
    'trends': function(){
        return Trends.find({"user_id": Meteor.userId()}, {sort: {"creationDate": -1}});
    }
});