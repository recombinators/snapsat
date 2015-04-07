var $ = require('jquery');

// Start polling for preview and full render job status and take action when document is ready
$( document ).ready(function() {
    var previewIntervalTime = 1000;
    var previewIntervalID = setInterval(startPreviewPoll(previewIntervalID), previewIntervalTime);
    var statusIntervalTime = 10000;
    var statusIntervalID = setInterval(startStatusPoll(statusIntervalID), statusIntervalTime);
});

// Stop polling for a preview when 
function stopPreviewPoll(data, previewintervalID){
    if(data.bool === false){
        clearInterval(intervalID);
    }
}

// Start polliing for preview status
function startPreviewPoll(previewIntervalID){
    $.ajax({
        url: "/preview_poll", 
        dataType: "json"
    }).done(function(data){
        console.log(data.bool);
        stopPreviewPoll(data.bool, previewIntervalID);
    });
}

// Stop polliing for full render status when
function stopStatusPoll(data, statusintervalID){
    if(data.bool === false){
        clearInterval(intervalID);
    }
}

// Start polliing for full render status
function startStatusPoll(){
    $.ajax({
        url: "/status_poll", 
        dataType: "json"
    }).done(function(data){
        console.log(data.bool);
        stopStatusPoll(data.bool, intervalID);
    });
}
