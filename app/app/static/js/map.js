L.mapbox.accessToken = 'pk.eyJ1IjoiamFjcXVlcyIsImEiOiJuRm9TWGYwIn0.ndryRT8IT0U94pHV6o0yng';

// Create a basemap
var map = L.mapbox.map('map', 'jacques.k7coee6a', {
    zoomControl: true,
    maxZoom: 7,
    minZoom: 3
});

map.scrollWheelZoom.disable();
map.addControl(L.mapbox.geocoderControl('mapbox.places'));


//  Set column widths on column titles tables when page is ready
$(document).ready(function(){
    $.each($('.js-column_titles th'), function(i, value){
        var wid = $($(".js-group_head th")[i]).width();
        $(value).width(wid);
    }); 

    var lat = 47.568,
        lng = -122.582;

    // If available, use the stored Latitudes & Longitudes
    if (Modernizr.sessionstorage) {
        if (sessionStorage.getItem('lat') !== null) {
            lat = sessionStorage.lat;
        }
        if (sessionStorage.getItem('lng') !== null) {
            lng = sessionStorage.lng;
        }
    }
    map.setView([lat, lng], 7);
});


// Implement debouce to prevent excessive calls to database and ajax calls
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

        if (Modernizr.sessionstorage) {
            sessionStorage.lat = lat;
            sessionStorage.lng = lng;
        }

        scenes = json.scenes;
         
         // Update path-row groupings of scenes on map move
        $('#js-pathrowgrouping').html('');

            // Create new group for each path-row grouping.
            for (var i in scenes) {
                var scene = scenes[i];

                $('#js-pathrowgrouping').append(
                    "<h3>" +
                        "Path: <span class='bold'>" + scene[0].path + "</span> " +
                        "Row: <span class='bold'>" + scene[0].row + "</span> " +
                        "Time: <span class='bold'>~" + scene[0].average_time + " UTC</span>" +
                    "</h3>"
                );

                // Set id tag for each new table based.
                var num = i,
                    n = num.toString(),
                    id = 'tab'.concat(n);
                
                $('#js-pathrowgrouping').append(
                    $('<table class="table-hover mx-auto"></table>').attr('id', id)
                );

                var newid = '#'.concat(id);

                // Add date and cloud cover titles
                $(newid).append(
                    "<tr><th>Date</th><th class='regular gray'>Cloud Cover</th>"
                );

                // Generate entry for each date within a path-row group.
                for (var k in scene) {
                    $(newid).append(
                        '<tr class="hover" onclick="location.href = \'/scene/' + scene[k].entityid + '\';">' +
                            '<th>' + scene[k].acquisitiondate + '</th>' +
                            "<th class='regular gray'>" + scene[k].cloudcover + '%</th>' +
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
