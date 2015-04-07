var $ = require('jquery');

$( document ).ready(function() {
    (function poll(){
    $.ajax({
        url: '/status_poll',
        dataType: 'json',
        complete: poll,
        timeout: 50000
        }).done(function(data) {
                $('.longpolltesting').append(
                    "<p>Hello</p>"
                );
            });
    })();
});


