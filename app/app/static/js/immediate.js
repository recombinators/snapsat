// Seattle, WA
var lat = 47.568, lng = -122.582;

// Get lat/lng given IP
$.get("http://ipinfo.io", function(response) {
    // console.log(response);
    if (response.loc) {
      var temp = response.loc.split(",");
      lat = temp[0];
      lng = temp[1];
      // console.log(lat, lng);
    }
}, "jsonp");


// Subsequent render's ========================================================

// Debounce to prevent excessive AJAX calls
var sceneList = _.debounce(function() {

  // Define the center of the map.
  var center = map.getCenter(),
      lat = center.lat,
      lng = center.lng;

  // Submit a post request with the relevant information.
  $.ajax({
    url: "/immediate_preview_ajax",
    dataType: "json",
    data: {'lat': lat, 'lng': lng, },
  }).done(function(json) {

    var allScenes = json.scenes;

    if (Modernizr.sessionstorage) {
      sessionStorage['lat'] = lat;
      sessionStorage['lng'] = lng;
    }

    // Update path-row groupings of scenes on map move
    $('#js-preview').html('');

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




// Poll for preview
// Start polling for preview and full render job status and take action when document is ready
$(document).ready(function(){
  // Poll for preview image
  $(".js-nopreview").each(function(){
    var jobId = this.id;
    var intervalTime = 1000;
    var windowLoc = $(location).attr('pathname');
    var intervalID = setInterval(function poll(){
      $.ajax({
        url: "/preview_poll/",
        data: {'jobid': jobId},
        dataType: "json"
      }).done(function(json){
        var info = json.job_info;
        var newid = '#'.concat(jobId);
        if(info.jobstatus != 'Done' && info.jobstatus != 'Failed'){
          // Display loading gif.
          $(newid).html(
            "<div class='loading'><img src='/static/img/loading.gif'></div>");
        }else{
          if(info.jobstatus != 'Failed'){
            // Stop polling on success
            if(windowLoc.indexOf('bands') == -1){
              $(newid).html(
                "<a id= '" + info.scene_id + "'" +
                  "href='/scene/" + info.scene_id + "/bands/" +
                  info.band1 + info.band2 + info.band3 + "'" +
                  "class='js-preview block sm-col sm-col-6 md-col md-col-4 lg-col lg-col-3'" +
                  "style='background-image: url( " + info.renderurl + " );'>" +

                  "<h1 class='composite-description p1 m0'" + info.band1 + info.band2 + info.band3 + ">" +
                  "<span class='band-red'>    " + info.band1 + "</span>" +
                  "<span class='band-green'>    " + info.band2 + "</span>" +
                  "<span class='band-blue'>    " + info.band3 + "</span>" +
                  "</h1>" +
                  "</a>");
            }else{
              $(newid).html(
                "<div class='sm-col sm-col-6 p1'>" +
                  "<a href='" + info.renderurl + "' class='js-preview'>" +
                  "<img src='" + info.renderurl + "'>" +
                  "</a>" +
                  "</div>");
            }
            clearInterval(intervalID);
          }else{
            // Stop polling on failure
            $(newid).html(
              "<p><strong class='red'>Preview Failure</strong></p>");
              clearInterval(intervalID);
          }
        }
      });
    }, intervalTime);
  });

});

// Stop polling for a preview when
function stopPreviewPoll(data, intervalID){
  if(data.bool === false){
    clearInterval(intervalID);
  }
}

// Start polling for preview status
function startPreviewPoll(jobId, intervalID){
  $.ajax({
    url: "/preview_poll/",
    dataType: "json"
  }).done(function(data){
    if(data.bool === false){
      clearInterval(intervalID);
    }
  });
}
