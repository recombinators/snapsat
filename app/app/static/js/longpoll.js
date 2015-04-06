var $ = require('jquery');

$( document ).ready(function() {
  (function poll(){
    $.ajax({
        url: '/status_poll',
        success: function(data) {
            console.log(data.value);
        },
        dataType: 'json',
        complete: poll,
        timeout: 50000
    });
  })();
});


