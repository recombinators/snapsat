require('mapbox.js');
var $ = require('jquery');

// L.mapbox.accessToken = 'pk.eyJ1IjoiamFjcXVlcyIsImEiOiJuRm9TWGYwIn0.ndryRT8IT0U94pHV6o0yng';

// var image = 'https://s3-us-west-2.amazonaws.com/landsat-pds/L8/046/027/LC80460272015078LGN00/LC80460272015078LGN00_thumb_large.jpg';
// bounds = L.latLngBounds([
//     [48.51479, -123.40894],
//     [46.35246, -120.35891]]);

// var map = L.mapbox.map('map', 'jacques.lh797p9e', { 
//     zoomControl: true,
//     attributionControl: false
// });

// var overlay = L.imageOverlay(image, bounds).addTo(map);

// map.addControl(L.mapbox.geocoderControl('mapbox.places',{ keepOpen: true }));
// map.setView([47.568, -122.582], 9);
// map.scrollWheelZoom.disable();


// map.on('moveend', function() {
//     var center = map.getCenter();
//     var lat = center.lat;
//     var lng = center.lng;
//     $.ajax({
//         url: "/ajax",
//         dataType: "json",
//         data: {
//             'lat': lat,
//             'lng': lng,
//         },
//     }).done(function(json) {
//         // Update site contents with new data
//         data = json.scenes;
//         $('.scene_list').html('');
//             for (var i in data){
//                 var pad = "000";
//                 var r = data[i].row;
//                 var p = data[i].path;
//                 var r_result = (pad+r).slice(-pad.length);
//                 var p_result = (pad+p).slice(-pad.length);

//                 var min_lon = data[i].min_lon;
//                 var max_lon = data[i].max_lon;
//                 var min_lat = data[i].min_lat;
//                 var max_lat = data[i].max_lat;

//                 bounds = L.latLngBounds([
//                     [min_lat, min_lon],
//                     [max_lat, max_lon]]);

//                 console.log(bounds);
//                 overlay = L.imageOverlay(image, bounds).addTo(map);

//                 $('.scene_list').append(
//                     "<h3 class='js-trigger mbn'>" + data[i].acquisitiondate + "</h3>" +
//                     "<div class='details'>" +
//                         "<p>Path:" + data[i].path + "</p>" +
//                         "<p>Row:" + data[i].row + "</p>" +
//                         "<p>Cloud coverage:" + data[i].cloudcover + "</p>" +
//                         "<img src='https://s3-us-west-2.amazonaws.com/landsat-pds/L8/" + p_result + "/" + r_result + "/" + data[i].entityid + "/" + data[i].entityid + "_thumb_large.jpg'>" +
//                         "<form action='/request/" + data[i].entityid + "' method='post' id='request_form'>" +
//                         "<div id='combinations' class='display-inline-block'>" +
//                         "<h4 class='customband'>Select your custom band combinations</h4>" +
//                         "<div class='radiobox'>" +
//                         "<input type='radio' name='band_combo' value='432' checked>" + 
//                             "<label>Normal Colors: 4, 3, 2</label><br>" +
//                         "<input type='radio' name='band_combo' value='543'>" +
//                             "<label>See the Heat: 5, 4, 3</label><br>" +
//                         "<input type='radio' name='band_combo' value='532'>" +
//                             "<label>Veggie Popping: 5, 3, 2</label><br>" +
//                         "</div>" +
//                         "</div>" +    
//                         "<button form='request_form' formmethod='post' type='submit'>" +
//                             "Request" +
//                             "</button>" +
//                         "</form>" +
//                     "</div>");
//             }
//     });
// });

