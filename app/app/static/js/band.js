$("#band1").on('focus', function (){
    $("#band1").empty()
    var existingValues = [parseInt($("#band2").val()), parseInt($("#band3").val()), 8];
    console.log(existingValues);
    for (i=1; i < 10; i++) {
        if ($.inArray(i, existingValues) < 0) {
            $("#band1").append("<option value='" + i + "'>" + i + "</option>")
        }
    }
});
$("#band2").on('focus', function (){
    $("#band2").empty()
    var existingValues = [parseInt($("#band1").val()), parseInt($("#band3").val()), 8];
    console.log(existingValues);
    for (i=1; i < 10; i++) {
        if ($.inArray(i, existingValues) < 0) {
            $("#band2").append("<option value='" + i + "'>" + i + "</option>")
        }
    }
});
$("#band3").on('focus', function (){
    $("#band3").empty()
    var existingValues = [parseInt($("#band1").val()), parseInt($("#band2").val()), 8];
    console.log(existingValues);
    for (i=1; i < 10; i++) {
        if ($.inArray(i, existingValues) < 0) {
            $("#band3").append("<option value='" + i + "'>" + i + "</option>")
        }
    }
});
