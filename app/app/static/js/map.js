require('mapbox.js');
var $ = require('jquery');

L.mapbox.accessToken = 'pk.eyJ1IjoiamFjcXVlcyIsImEiOiJuRm9TWGYwIn0.ndryRT8IT0U94pHV6o0yng';

var map = L.mapbox.map('map', 'jacques.lh797p9e', { 
    zoomControl: true,
    attributionControl: false
});

map.addControl(L.mapbox.geocoderControl('mapbox.places',{ keepOpen: true }));
map.setView([47.568, -122.582], 9);
map.scrollWheelZoom.disable();


map.on('moveend', function() {
    var center = map.getCenter();
    var lat = center.lat;
    var lng = center.lng;

    $.ajax({
        url: "/ajax",
        dataType: "json",
        data: {
            'lat': lat,
            'lng': lng,
        },
    }).done(function(json) {
        // Update site contents with new data
        $(".test_lat").contents().replaceWith(json.lat);
        $(".test_lng").contents().replaceWith(json.lng);
        $("#available-scenes").contents().replaceWith(json.scenes);

    });
});

