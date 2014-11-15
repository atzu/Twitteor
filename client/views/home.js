Meteor.subscribe('trends');
 
chartCols=[];

Template.home.helpers({
    'trends': function(){
        return Trends.find({"user_id": Meteor.userId()});
    }
});

columns = function(){
	var items= Trends.find({}).fetch();
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
		type: 'bar'
    }
});



Meteor.setInterval(function () {
chartCols.forEach(function (item){
	if (item.length>1){
		item.splice(1, 1);
	}
	item.push(Math.floor((Math.random() * 10) + 1));
});	
chart.load({
  columns: chartCols
});
  ;
}, 3000);

}