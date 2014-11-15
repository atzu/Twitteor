Meteor.subscribe('trends');
 
chartCols=[];

Template.home.helpers({
    'trends': function(){
        return Trends.find({"user_id": Meteor.userId()}, {sort: {"creationDate": -1}});
    }
});

columns = function(){
	var items= Trends.find({}, {sort:{"creationDate" : -1}, limit: 3}).fetch();
	var cols="";
	names=[];
	items.forEach(function (item){
		var element=[];
		element.push(item.name);
		element.push(Math.floor((Math.random() * 10) + 1));
		names.push(element);
	});
	return names;
}

chart = function() {
	chartCols=columns();
	console.log(JSON.stringify(chartCols));
	var chart = c3.generate({
    data: {
        columns: chartCols,
		type: 'spline'
    }
});



Meteor.setInterval(function () {
chartCols.forEach(function (item){
	item.push(Math.floor((Math.random() * 10) + 1));
});	
chart.load({
  columns: chartCols
});
  ;
}, 5000);

}