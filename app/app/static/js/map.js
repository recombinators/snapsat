L.mapbox.accessToken = 'pk.eyJ1IjoiamFjcXVlcyIsImEiOiJuRm9TWGYwIn0.ndryRT8IT0U94pHV6o0yng';



// Initial render =============================================================

// Create a basemap
var map = L.mapbox.map('map', 'jacques.k7coee6a', {
  zoomControl: false,
  scrollWheelZoom: false,
  minZoom: 3,
  maxZoom: 7
});

// Position navigation tools at the bottom of the map.
// Searchbar
new L.mapbox.geocoderControl('mapbox.places', {
  position: 'bottomright'
}).addTo(map);
// Zoomer
new L.Control.Zoom({ 
  position: 'bottomright' 
}).addTo(map);

// Seattle, WA
var lat = 47.568, lng = -122.582;
var temp = 0;
$.get("http://ipinfo.io", function(response) {
    temp = response.loc;
    temp = temp.split(",");
    lat = temp[0]
    lng = temp[1]
    console.log(lat, lng);
}, "jsonp");

$(document).ready(function() {
  // If user has moved the map, reset to their last location.
  if (Modernizr.sessionstorage) {
    if (sessionStorage.getItem("lat") != null) { lat = sessionStorage['lat']; }
    if (sessionStorage.getItem("lng") != null) { lng = sessionStorage['lng']; }
  }

  // Position the map in the appropriate location
  map.setView([lat, lng], 7);
});


// Subsequent render's ========================================================

// Debounce to prevent excessive AJAX calls
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

    var allScenes = json.scenes;

    if (Modernizr.sessionstorage) {
      sessionStorage['lat'] = lat;
      sessionStorage['lng'] = lng;
    }

    // Update path-row groupings of scenes on map move
    $('#js-pathrowgrouping').html('');

    for (var i in allScenes) {

      var scenes = allScenes[i],
          index = i.toString(),
          // Group scenes by Path/Row
          sceneByPathRow = 'pathrowgroup'.concat(index),
          sceneByPathRowID = '#'.concat(sceneByPathRow),
          // Further group scenes to just include actual scenes
          listOfScenes = 'pathrowsubgroup'.concat(index),
          listOfScenesID = '#'.concat(listOfScenes);

      // Each Path/Row has it's own column.
      // Note: By just passing in `class='col'`, the width is set based on size
      $('#js-pathrowgrouping').append(
        $('<div class="col p1 mobile"></div>').attr('id', sceneByPathRow)
      );

      // Create the headings for each Path/Row listing
      $(sceneByPathRowID).append(
        "<h4 class='mb1'>Path " + scenes[0].path + " - " + "Row " + scenes[0].row + "</h4>" +
        "<div class='flex flex-justify border-bottom'>" +
          "<p class='mb0 h5'>Date</p>" +
          "<p class='mb0 gray h5'>Cloud cover</p>" +
        "</div>"
      );

      // Add the full list of available scenes
      $(sceneByPathRowID).append(
        $('<div></div>').attr('id', listOfScenes)
      );

      // Generate entry for each date within a path-row group.
      for (var k in scenes) {
        $(listOfScenesID).append(
          "<div class='mobile'>" +
            "<a style='text-decoration: none' class='flex flex-justify button-transparent' href ='/scene/" + scenes[k].entityid + "'>" +
              "<div class='regular black mr4'>" + scenes[k].acquisitiondate + "</div>" +
              "<div class='regular gray'>" + scenes[k].cloudcover + "%</div>" + 
            "</a>" +
          "</div>"
        );
      }
    }
  });
}, 250);

// Once a user finishes moving the map, send an AJAX request to Pyramid
// which will repopulate the HTML with an updated list of the Landsat
// scenes present.
map.on('moveend', sceneList);
