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

        scenes = json.scenes_date;
        scenes_pr = json.scenes_path_row;
        
        $('#pathrowgrouping').html('');
            for (var i in scenes_pr) {
                var num = i;
                var n = num.toString();
                var id = 'tab'.concat(n);
                $('#pathrowgrouping').append(
                    $('<table></table>').attr('id', id)
                    );

                var scenes_path_row = scenes_pr[i];
                var newid = '#'.concat(id);
                $(newid).html('');
                    $(newid).append(
                        "<tr><td><strong>" + scenes_path_row[0].sliced + "</strong></td></tr>"
                        );
                    for (var k in scenes_path_row) {
                        $(newid).append(
                            "<tr>" +
                                "<td>" + scenes_path_row[k].acquisitiondate + "</td>" +
                                "<td>" + scenes_path_row[k].path + "</td>" +
                                "<td>" + scenes_path_row[k].row + "</td>" +
                                "<td>" + scenes_path_row[k].cloudcover + "</td>" +
                                "<td><a href='/scene/" + scenes_path_row[k].entityid + "'>" + scenes_path_row[k].entityid + "</a></td>" +
                                "<td>" + scenes_path_row[k].sliced + "</td>" +
                            "</tr>");
                    }
            }

        $('#dategrouping').html('');
            for (var j in scenes) {
                $('#dategrouping').append(
                    "<tr>" +
                        "<td>" + scenes[j].acquisitiondate + "</td>" +
                        "<td>" + scenes[j].path + "</td>" +
                        "<td>" + scenes[j].row + "</td>" +
                        "<td>" + scenes[j].cloudcover + "</td>" +
                        "<td><a href='/scene/" + scenes[j].entityid + "'>" + scenes[j].entityid + "</a></td>" +
                        "<td>" + scenes[j].sliced + "</td>" +
                    "</tr>");
            }
    });
});
