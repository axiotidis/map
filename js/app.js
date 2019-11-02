var basemap = new L.TileLayer(baseUrl, {maxZoom: 17, attribution: baseAttribution, subdomains: subdomains, opacity: opacity});
var map = new L.Map('map', {center: center, zoom: 5, maxZoom: maxZoom, layers: [basemap]});

var lat = 0;	//set initial lalue
var lng = 0;	//set initial lalue
var zoom = 5;	//set zoom level

var popup = L.popup();

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition);
  }
  
function setPosition(position) {
  lat = position.coords.latitude.toString();		//find latitude
  lng = position.coords.longitude.toString();		//find lognitude
  var marker = new L.marker([lat, lng]).addTo(map);	//set a marker in current geoposition
  //marker.bindPopup("<img src=\"pic.jpg\"><br><br><b>You are here</b><br>"Latitude  = " + lat.toString()).openOn(map);
  marker.bindPopup("<img src=\"pic.jpg\"><br><br><b>You are here</b><br>Latitude  = " + lat.toString()"");
		   
  map.setView([lat, lng], zoom);		
}


var center = new L.LatLng(lat, lng);


//var map = new L.Map('map', {center: center, zoom: 2, maxZoom: maxZoom, layers: [basemap]});	//original





function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("You are at " + lat.toString()+" ,"+lng.toString())
		.openOn(map);
}

map.on('click', onMapClick);

/*function onLocationFound(e) {
        var radius = e.accuracy / 2;

        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(e.latlng, radius).addTo(map);
    }

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    map.locate({setView: true, maxZoom: 16});*/

/*set a marker on clicked point
function onMapClick(e) {
	var marker = new L.marker(e.latlng).addTo(map)
		
}
map.on('click', onMapClick);*/

//var marker = new L.marker([51.5, -0.09]).addTo(map);	//put a marker in a fixed position

//marker.bindPopup("<img src=\"pic.jpg\"><br><br><b>Hello world!</b><br>I am a popup.<br>");
//marker.bindPopup("<b>Hello world!</b><br>I am a popup.<br>").openPopup();	//bind a popup with a marker

var popupOpts = {
    autoPanPadding: new L.Point(5, 50),
    autoPan: true
};

var points = L.geoCsv (null, {
    firstLineTitles: true,
    fieldSeparator: fieldSeparator,
    onEachFeature: function (feature, layer) {
        var popup = '<div class="popup-content"><table class="table table-striped table-bordered table-condensed">';
        for (var clave in feature.properties) {
            var title = points.getPropertyTitle(clave).strip();
            var attr = feature.properties[clave];
            if (title == labelColumn) {
                layer.bindLabel(feature.properties[clave], {className: 'map-label'});
            }
            if (attr.indexOf('http') === 0) {
                attr = '<a target="_blank" href="' + attr + '">'+ attr + '</a>';
            }
            if (attr) {
                popup += '<tr><th>'+title+'</th><td>'+ attr +'</td></tr>';
            }
        }
        popup += "</table></popup-content>";
        layer.bindPopup(popup, popupOpts);
    },
    filter: function(feature, layer) {
        total += 1;
        if (!filterString) {
            hits += 1;
            return true;
        }
        var hit = false;
        var lowerFilterString = filterString.toLowerCase().strip();
        $.each(feature.properties, function(k, v) {
            var value = v.toLowerCase();
            if (value.indexOf(lowerFilterString) !== -1) {
                hit = true;
                hits += 1;
                return false;
            }
        });
        return hit;
    }
});

var hits = 0;
var total = 0;
var filterString;
var markers = new L.MarkerClusterGroup();
var dataCsv;

var addCsvMarkers = function() {
    hits = 0;
    total = 0;
    filterString = document.getElementById('filter-string').value;

    if (filterString) {
        $("#clear").fadeIn();
    } else {
        $("#clear").fadeOut();
    }

    map.removeLayer(markers);
    points.clearLayers();

    markers = new L.MarkerClusterGroup(clusterOptions);
    points.addData(dataCsv);
    markers.addLayer(points);

    map.addLayer(markers);
    try {
        var bounds = markers.getBounds();
        if (bounds) {
            map.fitBounds(bounds);
        }
    } catch(err) {
        // pass
    }
    if (total > 0) {
        $('#search-results').html("Showing " + hits + " of " + total);
    }
    return false;
};

var typeAheadSource = [];

function ArrayToSet(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}

function populateTypeAhead(csv, delimiter) {
    var lines = csv.split("\n");
    for (var i = lines.length - 1; i >= 1; i--) {
        var items = lines[i].split(delimiter);
        for (var j = items.length - 1; j >= 0; j--) {
            var item = items[j].strip();
            item = item.replace(/"/g,'');
            if (item.indexOf("http") !== 0 && isNaN(parseFloat(item))) {
                typeAheadSource.push(item);
                var words = item.split(/\W+/);
                for (var k = words.length - 1; k >= 0; k--) {
                    typeAheadSource.push(words[k]);
                }
            }
        }
    }
}

if(typeof(String.prototype.strip) === "undefined") {
    String.prototype.strip = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

map.addLayer(markers);

$(document).ready( function() {
    $.ajax ({
        type:'GET',
        dataType:'text',
        url: dataUrl,
        contentType: "text/csv; charset=utf-8",
        error: function() {
            alert('Error retrieving csv file');
        },
        success: function(csv) {
            dataCsv = csv;
            populateTypeAhead(csv, fieldSeparator);
            typeAheadSource = ArrayToSet(typeAheadSource);
            $('#filter-string').typeahead({source: typeAheadSource});
            addCsvMarkers();
        }
    });

    $("#clear").click(function(evt){
        evt.preventDefault();
        $("#filter-string").val("").focus();
        addCsvMarkers();
    });

});
