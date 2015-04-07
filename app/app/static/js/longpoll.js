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
    var intervalTime = 1000;
    var intervalID = setInterval(startPreviewPoll, intervalTime);
});

function stopPreviewPoll(data, intervalID){
    if(data.bool === false){
        clearInterval(intervalID);
    }
}


function startPreviewPoll(){
    $.ajax({
        url: "/status_poll", 
        dataType: "json"
    }).done(function(data){
        console.log(data.bool);
        stopPreviewPoll(data.bool, intervalID);
    });
}
