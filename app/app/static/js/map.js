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
    var email = 'hi@jacquestardie.org';
    var b1 = 4;
    var b2 = 3;
    var b3 = 2;

    var center = map.getCenter();
    var lat = center.lat;
    var lng = center.lng;
    console.log(lat, lng);

    $.ajax({
        url: "/submit",
        dataType: "json",
        data: {
            'lat': lat,
            'lng': lng,
            'email': email,
            'b1': b1,
            'b2': b2,
            'b3': b3
        },
    }).done(function(e) {
        console.log('Oh... My... God.')
    });
});
