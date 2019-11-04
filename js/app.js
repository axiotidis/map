
var basemap = new L.TileLayer(baseUrl, {maxZoom: 17, attribution: baseAttribution, subdomains: subdomains, opacity: opacity});

var lat = 0;	//set initial value
var lng = 0;	//set initial value
var zoom = 15;	//set zoom level

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

var map = new L.map('map', {center: center, zoomControl: false, maxZoom: maxZoom, layers: [basemap] });

function onLocationFound(e) {
        //center and zoom map in a position found by geolocation
	var center = new L.LatLng(lat, lng);
	
    }

    function onLocationError(e) {
	//center and zoom map in a 0, 0 position
	var center = new L.LatLng(lat, lng);
        alert(e.message);
    }

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);


//set a marker on clicked point
function onMapClick(e) {
	var marker = new L.marker(e.latlng, {icon: greenIcon}).addTo(map)
		
}
map.on('click', onMapClick);
