L.mapbox.accessToken = 'pk.eyJ1IjoiamFjcXVlcyIsImEiOiJuRm9TWGYwIn0.ndryRT8IT0U94pHV6o0yng';

// Create a basemap
var map = L.mapbox.map('map', 'jacques.k7coee6a', {
    zoomControl: true,
    maxZoom: 7,
    minZoom: 3
});

//  Set column widths on column titles tables when page is ready
$(document).ready(function(){
    $.each($('.js-column_titles th'), function(i, value){
        var wid = $($(".js-group_head th")[i]).width();
        $(value).width(wid);
    }); 

    var lat = 47.568
    var lng = -122.582
    // get stored lat/lng if available
    if (Modernizr.sessionstorage) {
        // session storate available
        if (sessionStorage.getItem("lat") != null) {
            lat = sessionStorage['lat'];
        }
        if (sessionStorage.getItem("lng") != null) {
            lng = sessionStorage["lng"]
        }
    }

    map.setView([lat, lng], 7);
    map.scrollWheelZoom.disable();
    // L.control.fullscreen.addTo(map);
    map.addControl(L.mapbox.geocoderControl('mapbox.places'));
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
        // Store lat and lng
        if (Modernizr.sessionstorage) {
            // session storate available
            sessionStorage['lat'] = lat;
            sessionStorage['lng'] = lng;
        }

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

                // Set id tag for each new table based.
                var num = i;
                var n = num.toString();
                var id = 'tab'.concat(n);
                
                $('#js-pathrowgrouping').append(
                    $('<table class="table-hover"></table>').attr('id', id)
                );

                var newid = '#'.concat(id);

                // Add date and cloud cover titles
                $(newid).append(
                    "<tr><th>Date</th><th class='regular gray'>Cloud Cover</th>"
                );

                // Generate entry for each date within a path-row group.
                for (var k in scenes_path_row) {
                    $(newid).append(
                        '<tr class="hover" onclick="location.href = \'/scene/' + scenes_path_row[k].entityid + '\';">' +
                            '<th>' + scenes_path_row[k].acquisitiondate + '</th>' +
                            "<th class='regular gray'>" + scenes_path_row[k].cloudcover + '%</th>' +
                            "</tr>"
                    );
                }
        }
    });
}, 250);

// Once a user finishes moving the map, send an AJAX request to Pyramid
// which will repopulate the HTML with an updated list of the Landsat
// scenes present.
map.on('moveend', sceneList);
