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
        var intervalTime = 5000;
        if(jobId){
            var intervalID = setInterval(function poll(){
                $.ajax({
                    url: "/status_poll",
                    data: {'jobid': jobId},
                    dataType: "json"
                }).done(function(json){
                    var info = json.job_info;
                    var newid = '#'.concat(jobId);
                    if(info.status != 'Done' && info.status != 'Failed'){
                        console.log('hello');
                        console.log(info.status);
                        console.log(info.elapsedtime);
                        $(newid).find("#fullstatus").html(info.status);
                        $(newid).find("#fullelapsedtime").html(info.elapsedtime);
                    }else{
                        $(newid).html(
                            "<p>Current status: <strong class='red'><a href=" + info.fullurl + ">{{ composite.fullstatus }}! Download Full Zip</a></strong></p>");
                        clearInterval(intervalID);
                    }
                });
            }, intervalTime);
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
