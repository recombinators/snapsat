$(document).ready(function() {
  var fade_time = 500;
  $('body').click(function() {
    $('#logo').fadeOut(fade_time);
  });
  $(window).scroll(function() {
    $('#logo').fadeOut(fade_time);
  });
});

