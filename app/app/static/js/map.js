L.mapbox.accessToken = 'pk.eyJ1IjoiamFjcXVlcyIsImEiOiJuRm9TWGYwIn0.ndryRT8IT0U94pHV6o0yng';

var southWest = L.latLng(90, 180),
    northEast = L.latLng(-90, -180),
    bounds = L.latLngBounds(southWest, northEast);
 
// Create a basemap
var map = L.mapbox.map('map', 'jacques.k7coee6a', {
    zoomControl: true,
    maxBounds: bounds,
    maxZoom: 7,
    minZoom: 3
});
map.setView([47.568, -122.582], 7);
map.scrollWheelZoom.disable();
// L.control.fullscreen.addTo(map);
map.addControl(L.mapbox.geocoderControl('mapbox.places'));
//  Set column widths on column titles tables when page is ready
$(document).ready(function(){
    $.each($('.js-column_titles th'), function(i, value){
                var wid = $($(".js-group_head th")[i]).width();
                $(value).width(wid);
    }); 
});

//  Implement debouce to prevent excessive calls to database and ajax calls
// running into each other causing the application to hang
var sceneList = _.debounce(function() {
    // Define the center of the map.
    var center = map.getCenter(),
        lat = center.lat,
        lng = center.lng;
    
    // Submit a post request with the relevant information.
    $.ajax({
        url: "/scene_options_ajax",
        dataType: "json",
        data: {'lat': lat, 'lng': lng, },
    }).done(function(json) {
        scenes_pr = json.scenes;
         
         // Update path-row groupings of scenes on map move
        $('#js-pathrowgrouping').html('');

            // Create new group for each path-row grouping.
            for (var i in scenes_pr) {
                var scenes_path_row = scenes_pr[i];

                $('#js-pathrowgrouping').append(
                    "<h3>" +
                        "Path: <span class='bold'>" + scenes_path_row[0].path + "</span> " +
                        "Row: <span class='bold'>" + scenes_path_row[0].row + "</span> " +
                        "Time: <span class='bold'>~" + scenes_path_row[0].average_time + " UTC</span>" +
                    "</h3>"
                );

                // Generate entry for each date within a path-row group.
                for (var k in scenes_path_row) {
                    $('#js-pathrowgrouping').append(
                        "<a class='button button-transparent' href='/scene/" + scenes_path_row[k].entityid + "'>" +
                            "<p class='mb0'>" +
                                scenes_path_row[k].acquisitiondate +
                                "<br class='md-show'>" +
                                "<span class='regular gray'>" + scenes_path_row[k].cloudcover + "%</span>" +
                            "</p>" +
                        "</a>"
                    );
                }

                // // Set id tag for each new table based.
                // var num = i;
                // var n = num.toString();
                // var id = 'tab'.concat(n);
    
                // $('#js-pathrowgrouping').append(
                //     $('<table></table>').attr('id', id)
                // );
    
                // var scenes_path_row = scenes_pr[i];
                // var newid = '#'.concat(id);

                // // Create title for each path-row group table.
                // $(newid).append(
                //     "<thead class='group_head'><tr><th class='light uppercase h2'> Path-Row: " + scenes_path_row[0].path + "-" + scenes_path_row[0].row + "</th></thead>"
                // );

                // // Create sub titles for date and cloudcover
                // $(newid).append(
                //     '<th class="date">Date acquired</th><th class="cloud">Cloud cover</th>'
                // );

                
        }
    });
}, 250);

// Once a user finishes moving the map, send an AJAX request to Pyramid
// which will repopulate the HTML with an updated list of the Landsat
// scenes present.
map.on('moveend', sceneList);
