var $ = require('jquery');

// Start polling for preview and full render job status and take action when document is ready
$( document ).ready(function() {

    $(".nopreview").each(function(i, obj){
        var jobId = $(obj).attr('id');
        var intervalTime = 1000;
        var intervalID = setInterval(startPreviewPoll(jobId, intervalID), intervalTime);
    });
    
    $(".nofull").each(function(){
        var jobId = $(obj).attr('id');
        var statusIntervalTime = 10000;
        var statusIntervalID = setInterval(startStatusPoll(jobId, intervalID), intervalTime);
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
        url: "/preview_poll", 
        dataType: "json"
    }).done(function(data){
        console.log(data.bool);
        stopPreviewPoll(data.bool, intervalID);
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
        url: "/status_poll", 
        dataType: "json"
    }).done(function(data){
        console.log(data.bool);
        stopStatusPoll(data.bool, intervalID);
    });
}
