// A jQuery script to dynamically limit band selections to 1-7 and 9. It also
// does not allow the user to select the same band more than once.
$("#band1").on('focus', function (){
    // Delete existing options
    $("#band1").empty()
    // Make array with values from other select boxes and 8, so user cannot
    // select an existing selection or 8
    var existingValues = [parseInt($("#band2").val()), parseInt($("#band3").val()), 8];
    // Add options if they are not in exisitingValues array
    for (i=1; i < 10; i++) {
        if ($.inArray(i, existingValues) < 0) {
            $("#band1").append("<option value='" + i + "'>" + i + "</option>")
        }
    }
});
$("#band2").on('focus', function (){
    // Delete existing options
    $("#band2").empty()
    // Make array with values from other select boxes and 8, so user cannot
    // select an existing selection or 8
    var existingValues = [parseInt($("#band1").val()), parseInt($("#band3").val()), 8];
    // Add options if they are not in exisitingValues array
    for (i=1; i < 10; i++) {
        if ($.inArray(i, existingValues) < 0) {
            $("#band2").append("<option value='" + i + "'>" + i + "</option>")
        }
    }
});
$("#band3").on('focus', function (){
    // Delete existing options
    $("#band3").empty()
    // Make array with values from other select boxes and 8, so user cannot
    // select an existing selection or 8
    var existingValues = [parseInt($("#band1").val()), parseInt($("#band2").val()), 8];
    // Add options if they are not in exisitingValues array
    for (i=1; i < 10; i++) {
        if ($.inArray(i, existingValues) < 0) {
            $("#band3").append("<option value='" + i + "'>" + i + "</option>")
        }
    }
});
