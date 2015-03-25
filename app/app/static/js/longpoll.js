var $ = require('jquery');

(function poll(){
    $.ajax({
        url: '/update',
        success: function(data) {
            console.log(data.value);
        },
        dataType: 'json',
        complete: poll,
        timeout: 50000
    });
})();
