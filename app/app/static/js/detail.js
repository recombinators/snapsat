var $ = require('jquery');

$('.js-trigger').click(function() {
    $(this).next('.details').toggle();
});
