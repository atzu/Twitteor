
//GeoCoding for map searching
map=null;
var url="https://maps.googleapis.com/maps/api/geocode/json";
var params="address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=API_KEY";
var key="AIzaSyCUNeuwPiagScwERwqC3EZcquwf3-cDioc";
var address="Oviedo";

Meteor.subscribe('geotweets');




Template.mapping.helpers({
    'geotweets': function(){
      console.log('added');
        return GeoTweets.find({"user_id": Meteor.userId()}, {sort: {"creationDate": -1}});
      }
});



mapInit = function(){
GoogleMaps.init(
    {
        'sensor': true, //optional
        'key': key, //optional
        'language': 'en' //optional
    }, 
    function(){
        var mapOptions = {
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.MAP
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions); 
        map.setCenter(new google.maps.LatLng( 43.3619145, -5.849388699999963));
    }
);
}

stopStream=function(){
	var user_id=Meteor.userId();
	Meteor.call('stopStream', user_id, function(e, r) {
			console.log('stop request');
    });
}
setCenter= function(position){
	console.log(position);
	map.setCenter(new google.maps.LatLng( position.lat, position.lng ));
}

setCenterMaps=function(bounds){
	map.fitBounds(bounds);
}

getLocation=function() {
	console.log('trying to get local position');
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
showPosition=function(position) {
	var x = document.getElementById("city-coords");
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude; 
    var latlng= {lat: position.coords.latitude , lng: position.coords.longitude}
    bounds_area=[latlng.lng-1, latlng.lat-1, latlng.lng, latlng.lat];
    console.log(bounds_area);
    setCenter(latlng);
    user_id=Meteor.userId();
    //Meteor.call('twitsByLocation', user_id, bounds_area, function(e, r) {
      //});
}

composeBounds= function(bounds){
	//var city_area = [  '-122.75', '36.8', '-121.75', '37.8' ];
	var bounds_area = [  bounds.va.j, bounds.Ea.k,  bounds.va.k, bounds.Ea.j ];
	//console.log("City area: "+city_area);
	console.log("Bounds area: "+bounds_area);
	user_id=Meteor.userId();
	Meteor.call('twitsByLocation', user_id, bounds_area, function(e, r) {
      });
  update();
}

updateBanners= function(city, position){
	var x = document.getElementById("city-coords");
    x.innerHTML = "Latitude: " + firstLoc.k + 
    "<br>Longitude: " + firstLoc.B; 
    $('#city-name').html(city);
}

showMarker = function(latlng){

// To add the marker to the map, use the 'map' property
var marker = new google.maps.Marker({
    position: latlng,
    map: map,
    animation: google.maps.Animation.DROP

});
}

Template.mapping.events({
'click #map-search': function (event) {
	console.log('called');
	 geocoder = new google.maps.Geocoder();
	 	address=$('#city').val();
	 	console.log(address);
        geocoder.geocode( {'address': address  },
          function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              firstLoc = results[0].geometry.location;
              console.log(firstLoc);
              bounds=results[0].geometry.bounds;
              setCenterMaps(bounds);
              updateBanners(address, firstLoc);
              console.log(JSON.stringify(bounds));
              composeBounds(bounds);

			}
		});
	},
'click #stream-stop': function (event) {
	console.log('click');
		stopStream();
	}
});

update = function(){
GeoTweetsCursor =GeoTweets.find({});
GeoTweetsCursor.observe({
    added: function(item){
        console.log('added element'+item.lat);
        showMarker(new google.maps.LatLng(item.lat, item.lng))
    }
}); 
}

