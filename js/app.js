
var basemap = new L.TileLayer(baseUrl, {maxZoom: 17, attribution: baseAttribution, subdomains: subdomains, opacity: opacity});

var lat = 0;		//set initial value latitude
var lng = 0;		//set initial value lognitude
var zoom = 15;		//set zoom level
var myPosition = 0;	//set an initial value of user's location
var range = 10;		//set default range to 10km
var indx = 0;		//set the array index
var poi = [
	[],
	[]
	];	//this array holds the marker's details

var greenIcon = L.icon({			//set a personal marker icon
	iconUrl: 'img/leaf-green.png',
	shadowUrl: 'img/leaf-shadow.png',

	iconSize:     [38, 95], // size of the icon
	shadowSize:   [50, 64], // size of the shadow
	iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
	shadowAnchor: [4, 62],  // the same for the shadow
	popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var popup = L.popup();

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition);
  }


function setPosition(position) {
  lat = position.coords.latitude.toString();		//find latitude
  lng = position.coords.longitude.toString();		//find lognitude
  var marker = new L.marker([lat, lng], {icon: greenIcon}).addTo(map);	//set a marker in current geoposition
  var mypopup = "<img src=\"img/pic.jpg\"/>";		//prepare a custom popup 
	mypopup += "<br><br><b>You are here</b>";
	mypopup += "<br><b>Latitude  =  </b>";
	mypopup += lat;
	mypopup += "<br><b>Longitude  =  </b>";
	mypopup += lng;
   marker.bindPopup(mypopup);
  	   
  map.setView([lat, lng], zoom);		
}

//center and zoom map in a position found by geolocation
var center = new L.LatLng(lat, lng);
var map = new L.map('map', {center: center, zoomControl: false, maxZoom: maxZoom, layers: [basemap] });

function onLocationFound(e) {
        //do nothing
	
    }

    function onLocationError(e) {
        alert(e.message);
    }

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);


//set a marker on clicked point
function onMapClick(e) {
	var marker = new L.marker(e.latlng, {icon: greenIcon}).addTo(map);
	var markPosition = e.latlng;
	var lat1 = lat;	//this is from geolocation
	var lng1 = lng;	//this is from geolocation
	var lat2 = markPosition.lat;	//this is the marker's latitude
	var lng2 = markPosition.lng;	//this is the marker's lognitude
	var distance = getDistance([lat1, lng1], [lat2, lng2]).toFixed(2);
	var poiDetails = "Place " + indx + " , Latitude = " + lat2 + " , Lognitude = " + lng2;
	poi[indx][0] = poiDetails;
	poi[indx][1] = distance;
	++indx;
	
	//for testing
	marker.bindPopup(poiDetails + " " + distance + "km").openPopup();
	//marker.bindPopup("distance = " + distance + " km ").openPopup();
		
}
map.on('click', onMapClick);

function getDistance(origin, destination) {
    // return distance in km
    var lon1 = toRadian(origin[1]);
    var lat1 = toRadian(origin[0]);
    var lon2 = toRadian(destination[1]);
    var lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS;
}
function toRadian(degree) {
    return degree*Math.PI/180;
}
