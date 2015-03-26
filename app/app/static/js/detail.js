var $ = require('jquery');

$(document).on('click', '.js-trigger', function() {
    $(this).next('.details').toggle();
});
