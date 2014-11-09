map=null;

mapInit = function(){
GoogleMaps.init(
    {
        'sensor': true, //optional
        //'key': 'MY-GOOGLEMAPS-API-KEY', //optional
        'language': 'en' //optional
    }, 
    function(){
        var mapOptions = {
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.MAP
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions); 
        map.setCenter(new google.maps.LatLng( 35.363556, 138.730438 ));
    }
);
}
setCenter= function(position){
	map.setCenter(new google.maps.LatLng( position.lat, position.lng ));
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
	var x = document.getElementById("currentPosition");
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude; 
    var latlng= {lat: position.coords.latitude , lng: position.coords.longitude}
    setCenter(latlng);
}