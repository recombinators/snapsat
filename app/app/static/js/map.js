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
        // $('.scene_list').html('');
        //     for (i in data){
        //         $('#table-body').append(
        //             "<tr>" +
        //             "<td>" + data[i][0] + "</td>" +
        //             "<td>" + data[i][1] + "</td>" +
        //             "<td>" + data[i][2] + "</td>" +
        //             "</tr>");
        //         };
        // <h3 class='js-trigger mbn'>{{ s.acquisitiondate }}</h3>
        //                 <div class='details'>
        //                     <p>Path: {{ s.path }}</p>
        //                     <p>Row: {{ s.row }}</p>
        //                     <p>Cloud coverage: {{ s.cloudcover }}</p>
        //                     <img src="https://s3-us-west-2.amazonaws.com/landsat-pds/L8/{{'%03d' % s.path}}/{{'%03d' % s.row}}/{{s.entityid}}/{{s.entityid}}_thumb_large.jpg">
        //                     <form action="/request/{{s.entityid}}" method="post" id="request_form">
        //                     <div id='combinations' class='display-inline-block'>
        //                     <h4 class="customband">Select your custom band combinations</h4>
        //                     <div class="radiobox">
        //                     <input type="radio" name="band_combo" value="432" checked>
        //                         <label>Normal Colors: 4, 3, 2</label><br>
        //                     <input type="radio" name="band_combo" value="543">
        //                         <label>See the Heat: 5, 4, 3</label><br>
        //                     <input type="radio" name="band_combo" value="532">
        //                         <label>Veggie Popping: 5, 3, 2</label><br>
        //                     </div>
        //                     </div>    
        //                     <button form="request_form" formmethod="post" type="submit">
        //                         Request
        //                         </button>
        //                     </form>
        //                 </div>

    });
});

