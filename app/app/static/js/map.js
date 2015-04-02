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
        // $('path_row_grouping').html('');
        //     for (var i in scenes) {
        //         var pad = "000",
        //             r = scenes[i].row, r_result = (pad+r).slice(-pad.length),
        //             p = scenes[i].path, p_result = (pad+p).slice(-pad.length);
        //         $('path_row_grouping').append(
        //             "<tr>" +
        //                 "<td>" + scenes[i].acquisitiondate + "</td>" +
        //                 "<td>" + scenes[i].path + "</td>" +
        //                 "<td>" + scenes[i].row + "</td>" +
        //                 "<td>" + scenes[i].cloudcover + "</td>" +
        //                 "<td><a href='/scene/" + scenes[i].entityid + "'>" + scenes[i].entityid + "</a></td>" +
        //                 "<td>" + scenes[i].sliced + "</td>" +
        //             "</tr>");
        //     }
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
