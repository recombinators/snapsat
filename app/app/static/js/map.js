L.mapbox.accessToken = 'pk.eyJ1IjoiamFjcXVlcyIsImEiOiJuRm9TWGYwIn0.ndryRT8IT0U94pHV6o0yng';


//  Set column widths on column titles tables when page is ready
$(document).ready(function(){

  $.each($('.js-column_titles th'), function(i, value){
    var wid = $($(".js-group_head th")[i]).width();
    $(value).width(wid);
  }); 

  // Set default coordinates to Seattle, WA
  var lat = 47.568;
  var lng = -122.582;

  // Attempt to locate the user based on their IP
  $.getJSON('http://freegeoip.net/json/', function(json) {
    if (json) {
      lat = json.latitude;
      lng = json.longitude;
    }

    // If available, use the stored Latitudes & Longitudes
    if (Modernizr.sessionstorage) {
      if (sessionStorage.getItem('lat') !== null) { lat = sessionStorage.lat; }
      if (sessionStorage.getItem('lng') !== null) { lng = sessionStorage.lng; }
    }

    // Create a basemap
    var map = L.mapbox.map('map', 'jacques.lh797p9e', {
      zoomControl: false,
      maxZoom: 7,
      minZoom: 3,
    });

    map.setView([lat, lng], 7)
    map.scrollWheelZoom.disable()
    map.addControl(L.mapbox.geocoderControl('mapbox.places'));

  });
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

    for (var i in scenes_pr) {
      var scenes_path_row = scenes_pr[i];

      // Set id tag for each new pathrowgroup.
      var num = i;
      var n = num.toString();
      var id = 'pathrowgroup'.concat(n);

      $('#js-pathrowgrouping').append(
        $('<div class="flex flex-column p2"></div>').attr('id', id)
      );

      var newid = '#'.concat(id);

      // Create new group for each path-row grouping.
      $(newid).append(
        "<div>" +
          "<div>" +
          "Path-Row: <span class='bold'>" + scenes_path_row[0].path + "-" + scenes_path_row[0].row + "</span> " +
          "</div>" +
          "<div>" +
          "Time: <span class='bold'>~" + scenes_path_row[0].average_time + "</span><span class='ml1'>UTC</span>" +
          "</div>" +
          "</div>" +
          "<div class='flex flex-justify'>" +
          "<div>Date</div>" +
          "<div class='regular gray'>Cloud Cover</div>" +
          "</div>"
      );

      // Create new subgroup for each path-row grouping.
      var subid = 'pathrowsubgroup'.concat(n);

      $(newid).append(
        $('<div></div>').attr('id', subid)
      );

      var newsubid = '#'.concat(subid);


      // Generate entry for each date within a path-row group.
      for (var k in scenes_path_row) {
        $(newsubid).append(
          "<div>" +
            "<a style='text-decoration: none' class='flex flex-justify button-transparent' href ='/scene/" + scenes_path_row[k].entityid + "'>" +
            "<div class='regular black mr4'>" + scenes_path_row[k].acquisitiondate + "</div>" +
            "<div class='regular gray'>" + scenes_path_row[k].cloudcover + "%</div>" + 
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
