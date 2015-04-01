require('mapbox.js');
var $ = require('jquery');

L.mapbox.accessToken = 'pk.eyJ1IjoiamFjcXVlcyIsImEiOiJuRm9TWGYwIn0.ndryRT8IT0U94pHV6o0yng';


// Create a basemap
var map = L.mapbox.map('map', 'jacques.lh797p9e', {zoomControl: true});
map.setView([47.568, -122.582], 9);
map.scrollWheelZoom.disable();
map.addControl(L.mapbox.geocoderControl('mapbox.places'));


// Once a user finishes moving the map, send an AJAX request to Pyramid
// which will repopulate the HTML with an updated list of the Landsat
// scenes present.
map.on('moveend', function() {

    // Define the center of the map.
    var center = map.getCenter(),
        lat = center.lat,
        lng = center.lng;

    // Submit a post request with the relevant information.
    $.ajax({
        url: "/ajax",
        dataType: "json",
        data: {'lat': lat, 'lng': lng, }
    }).done(function(json) {

        data = json.scenes;

        $('table').html('');
            for (var i in data) {
                var pad = "000",
                    r = data[i].row, r_result = (pad+r).slice(-pad.length),
                    p = data[i].path, p_result = (pad+p).slice(-pad.length);

                $('table').append(
                    "<tr>" +
                        "<td>" + data[i].acquisitiondate + "</td>" +
                        "<td>" + data[i].path + "</td>" +
                        "<td>" + data[i].row + "</td>" +
                        "<td>" + data[i].cloudcover + "</td>" +
                        "<td><a href='/scene/" + data[i].entityid + "'>Start processing</a></td>" +
                    "</tr>");
            }
    });
});
