L.mapbox.accessToken = 'pk.eyJ1IjoiamFjcXVlcyIsImEiOiJuRm9TWGYwIn0.ndryRT8IT0U94pHV6o0yng';
 
 
// Create a basemap
var map = L.mapbox.map('map', 'jacques.k7coee6a', {zoomControl: true});
map.setView([47.568, -122.582], 7);
map.scrollWheelZoom.disable();
// L.control.fullscreen.addTo(map);
map.addControl(L.mapbox.geocoderControl('mapbox.places'));
//  Set column widths on column titles tables when page is ready
$(document).ready(function(){
    $.each($('.column_titles th'), function(i, value){
                var wid = $($(".group_head th")[i]).width();
                $(value).width(wid);
    }); 
});

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
        url: "/scene_options_ajax",
        dataType: "json",
        data: {'lat': lat, 'lng': lng, }
    }).done(function(json) {
        scenes_pr = json.scenes;
         
         // Update path-row groupings of scenes on map move
        $('#pathrowgrouping').html('');

            // Create new table for each path-row grouping.
            for (var i in scenes_pr) {

                // Set id tag for each new table based.
                var num = i;
                var n = num.toString();
                var id = 'tab'.concat(n);
 
                $('#pathrowgrouping').append(
                    $('<table></table>').attr('id', id)
                );
 
                var scenes_path_row = scenes_pr[i];
                var newid = '#'.concat(id);

                // Create title for each path-row group table.
                $(newid).append(
                    $("<thead class='group_head'><tr><th> Path-Row: " + scenes_path_row[0].path + "-" + scenes_path_row[0].row + "</th><th></th><th></th><th></th><th></th></tr></thead>")
                );

                // Generate rows for each date within a path-row group.
                for (var k in scenes_path_row) {
                    $(newid).append(
                        "<tr>" +
                            "<td>" + scenes_path_row[k].acquisitiondate + "</td>" +
                            "<td>" + scenes_path_row[k].path + "</td>" +
                            "<td>" + scenes_path_row[k].row + "</td>" +
                            "<td>" + scenes_path_row[k].cloudcover + "</td>" +
                            "<td><a href='/scene/" + scenes_path_row[k].entityid + "'>" + scenes_path_row[k].entityid + "</a></td>" +
                        "</tr>");
                }
        }
    });
});
