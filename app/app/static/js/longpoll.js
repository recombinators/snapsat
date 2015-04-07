var $ = require('jquery');

// Start polling for preview and full render job status and take action when document is ready
$(document).ready(function(){
    $(".nopreview").each(function(){
        var jobId = this.id;
        var intervalTime = 1000;
        var intervalID = setInterval(function poll(){
            $.ajax({
                url: "/preview_poll",
                data: {'jobid': jobId},
                dataType: "json"
            }).done(function(data){
                if(data.bool === false){
                    clearInterval(intervalID);
                }
            });
        });
    });
    
    $(".nofull").each(function(){
        var jobId = this.id;
        var intervalTime = 20000;
        if (jobId){
            var intervalID = setInterval(function poll(){
                $.ajax({
                    url: "/status_poll",
                    data: {'jobid': jobId},
                    dataType: "json"
                }).done(function(data){
                    if(data.bool === false){
                        clearInterval(intervalID);
                    }
                });
            });
        }
    });

});

// Stop polling for a preview when 
function stopPreviewPoll(data, intervalID){
    if(data.bool === false){
        console.log('preview stop');
        clearInterval(intervalID);
    }
}

// Start polliing for preview status
function startPreviewPoll(jobId, intervalID){
    $.ajax({
        url: "/preview_poll", 
        dataType: "json"
    }).done(function(data){
        console.log('preview ' + data.bool);
        console.log(intervalID);
        console.log(jobId);
        console.log(data.bool);
        if(data.bool === false){
            console.log('preview stop');
            clearInterval(intervalID);
        }
    });
}

// Stop polliing for full render status when
function stopStatusPoll(data, intervalID){
    if(data.bool === false){
        console.log('full stop');
        clearInterval(intervalID);
    }
}

// Start polliing for full render status
function startStatusPoll(jobId, intervalID){
    $.ajax({
        url: "/status_poll", 
        dataType: "json"
    }).done(function(data){
        console.log('full ' + data.bool);
        console.log(intervalID);
        console.log(jobId);
        console.log(data.bool);
        if(data.bool === false){
            console.log('status stop');
            clearInterval(intervalID);
        }
    });
}
