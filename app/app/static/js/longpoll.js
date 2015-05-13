// Start polling for preview and full render job status and take action when document is ready
$(document).ready(function(){

  // Poll for preview image
  $(".js-nopreview").each(function(){
    var jobId = this.id
        intervalTime = 1000;

    var intervalID = setInterval(function poll(){
      $.ajax({
        url: "/preview_poll/",
        data: {'jobid': jobId},
        dataType: "json"
      }).done(function(json){

        var info = json.job_info
            newid = '#'.concat(jobId);

        if(info.jobstatus != 'Done' && info.jobstatus != 'Failed'){
          // Display loading gif.
          $(newid).html("<div class='loading'><img src='/static/img/loading.gif'></div>");
        } else {

          if(info.jobstatus != 'Failed'){
            // Stop polling on success
            $(newid).html(
              "<a id= '" + info.scene_id + "'" +
                "href='/scene/" + info.scene + "/bands/" +
                info.band1 + info.band2 + info.band3 + "'" +
                "class='js-preview sm-col sm-col-6 md-col md-col-4 lg-col lg-col-3'" +
                "style='background-image: url( " + info.renderurl + " );'>" +
                  "<h1 class='composite-description p1 m0'>" +
                    "<span class='band-red'>" + info.band1 + "</span>" +
                    "<span class='band-green'>" + info.band2 + "</span>" +
                    "<span class='band-blue'>" + info.band3 + "</span>" +
                  "</h1>" +
                "</a>");
              clearInterval(intervalID);
          } else {
           // Stop polling on failure
            $(newid).html(
              "<p><strong class='red'>Preview Failure</strong></p>");
              clearInterval(intervalID);
          }
        }
      });
    }, intervalTime);
  });

  // Poll for full render job status
  $(".js-nofull").each(function(){
    var jobId = this.id;
    var intervalTime = 10000;
    if(jobId){
      var intervalID = setInterval(function poll(){
        $.ajax({
          url: "/status_poll/",
          data: {'jobid': jobId},
          dataType: "json"
        }).done(function(json){
          var info = json.job_info;
          var newid = '#'.concat(jobId);
          if(info.jobstatus != 'Done' && info.jobstatus != 'Failed'){
            // Update status and elapsed time.
            $(newid).find("#js-fullstatus").html(info.jobstatus);
          }else{
            if(info.jobstatus != 'Failed'){
              // Stop polling on success
              $(newid).html(
                "<a  class='button bg-grey black not-rounded full-width center'" +
                  "href=" + info.renderurl + ">Download full size image." +
                  "</a>");
                clearInterval(intervalID);
            }else{
              // Stop polling on failure
              $(newid).html(
                "<p><strong class='red'>Composite Failure</strong></p>");
                clearInterval(intervalID);
            }
          }
        });
      }, intervalTime);
    }
  });
});

// Stop polling for a preview when 
function stopPreviewPoll(data, intervalID){
  if(data.bool === false){
    clearInterval(intervalID);
  }
}

// Start polliing for preview status
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

// Stop polliing for full render status when
function stopStatusPoll(data, intervalID){
  if(data.bool === false){
    clearInterval(intervalID);
  }
}

// Start polliing for full render status
function startStatusPoll(jobId, intervalID){
  $.ajax({
    url: "/status_poll/", 
    dataType: "json"
  }).done(function(data){
    if(data.bool === false){
      clearInterval(intervalID);
    }
  });
}
