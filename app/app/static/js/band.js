// A jQuery script to dynamically limit band selections to 1-7 and 9. 
// It also does not allow the user to select the same band more than once.
$("#js-band1").on('focus', function (){
  // Delete existing options
  $("#js-band1").empty()
  // Make array with values from other select boxes and 8, so user cannot
  // select an existing selection or 8
  var existingValues = [parseInt($("#js-band2").val()), parseInt($("#js-band3").val()), 8];
  // Add options if they are not in exisitingValues array
  for (i=1; i < 10; i++) {
    if ($.inArray(i, existingValues) < 0) {
      $("#js-band1").append("<option value='" + i + "'>" + i + "</option>")
    }
  }
});

// Same as above, but with Band 2.
$("#js-band2").on('focus', function (){
  $("#js-band2").empty()
  var existingValues = [parseInt($("#js-band1").val()), parseInt($("#js-band3").val()), 8];
  for (i=1; i < 10; i++) {
    if ($.inArray(i, existingValues) < 0) {
      $("#js-band2").append("<option value='" + i + "'>" + i + "</option>")
    }
  }
});

// Same as above, but with Band 3.
$("#js-band3").on('focus', function (){
  $("#js-band3").empty()
  var existingValues = [parseInt($("#js-band1").val()), parseInt($("#js-band2").val()), 8];
  for (i=1; i < 10; i++) {
    if ($.inArray(i, existingValues) < 0) {
      $("#js-band3").append("<option value='" + i + "'>" + i + "</option>")
    }
  }
});
