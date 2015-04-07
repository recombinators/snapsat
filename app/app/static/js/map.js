require('mapbox.js');
var $ = require('jquery');
var hb = require('handlebars');

L.mapbox.accessToken = 'pk.eyJ1IjoiamFjcXVlcyIsImEiOiJuRm9TWGYwIn0.ndryRT8IT0U94pHV6o0yng';

// Create a basemap
var map = L.mapbox.map('map', 'jacques.lh797p9e', {zoomControl: true});
map.setView([47.568, -122.582], 9);
map.scrollWheelZoom.disable();
map.addControl(L.mapbox.geocoderControl('mapbox.places'));


// Once a user finishes moving the map, send an AJAX request to Pyramid
// which will repopulate the HTML with an updated list of the Landsat
// scenes appropriate to the lat/lon.
map.on('moveend', function() {

    // Name the center of the map.
    var center = map.getCenter(),
        lat = center.lat,
        lng = center.lng;

    // On `moveend`, submit a post request.
    $.ajax({
        url: "/scene_options_ajax",
        dataType: "json",
        data: {'lat': lat, 'lng': lng, }
    }).done(function(json) {

        scenes = json.scenes;
        
        // Empty the contents of .sceneList
        $('.sceneList').children().remove();

        // Iterate through each set of scenes and add them to the DOM.
        for (var i in scenes) {
            // Grab the scene's index and concatenate it with `tab`.
            // `newid` will be used
            var id = 'tab'.concat(i.toString()),
                newid = '#'.concat(id);

            var scene = scenes[i],

            // Append a heading and a table for each set of scenes.
            $('.sceneList').append('<h3></h3>'.attr('id', id).val('Test'));
            $('.sceneList').append('<table></table>').attr('id', id);

            $(newid).html('');
            $(newid).append(
                "<thead><tr><th>Date acquired</th><th>Path</th><th>Row</th><th>Cloud cover</th><th>ID</th></tr></thead>"
            );

            // Iterate through each scene in the scene list.
            for (var k in scene) {
                // Add a scene
                $(newid).append(
                    "<tr>" +
                        "<td>" + scene[k].acquisitiondate + "</td>" +
                        "<td>" + scene[k].path + "</td>" +
                        "<td>" + scene[k].row + "</td>" +
                        "<td>" + scene[k].cloudcover + "</td>" +
                        "<td><a href='/scene/" + scene[k].entityid + "'>" + scene[k].entityid + "</a></td>" +
                    "</tr>");
            }
        }
    });
});
