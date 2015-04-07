var $ = require('jquery');

$( document ).ready(function() {
    // (function poll(){
    //     setInterval(function(){
    //         $.ajax({
    //             url: '/status_poll',
    //             dataType: 'json',
    //             complete: poll,
    //             timeout: 20000
    //         }).done(function(data) {
    //                 console.log(data.bool);
    //                 // $('.longpolltesting').append(
    //                 //     "<p>Hello</p>"
    //                 // );
    //         });
    //     });
    // })();
    var previewIntervalTime = 1000;
    var previewIntervalID = setInterval(startPreviewPoll(previewIntervalID), previewIntervalTime);
    var statusIntervalTime = 10000;
    var statusIntervalID = setInterval(startStatusPoll(statusIntervalID), statusIntervalTime);
});

function stopPreviewPoll(data, previewintervalID){
    if(data.bool === false){
        clearInterval(intervalID);
    }
}


function startPreviewPoll(previewIntervalID){
    $.ajax({
        url: "/preview_poll", 
        dataType: "json"
    }).done(function(data){
        console.log(data.bool);
        stopPreviewPoll(data.bool, previewIntervalID);
    });
}

function stopStatusPoll(data, statusintervalID){
    if(data.bool === false){
        clearInterval(intervalID);
    }
}


function startStatusPoll(){
    $.ajax({
        url: "/status_poll", 
        dataType: "json"
    }).done(function(data){
        console.log(data.bool);
        stopStatusPoll(data.bool, intervalID);
    });
}
