function graph(graphId) {

    var id = '#'.concat(graphId);
    var width = $(id).parent().width();
    var parentId = $(id).parent().attr('id');
    var height = 20;
    var stroke_width = 1;
    var box_fill = "#FFF";
    var stroke_color = "#000";

    var font_size = 8;
    var red_band = Number($(id).parent().find($(".band-red")).html());
    var green_band = Number($(id).parent().find($(".band-green")).html());
    var blue_band = Number($(id).parent().find($(".band-blue")).html());
    var red_color = "red";
    var green_color = "green";
    var blue_color = "blue";

    var xLowNorm = 400;
    var widthNorm = 2294;
    var waveLengthsTop = [[503, 676, 8, box_fill],
                          [1362, 1384, 9, box_fill]];
    var waveLengthsBottom = [[435, 451, 1, box_fill],
                             [452, 512, 2, box_fill],
                             [533, 590, 3, box_fill],
                             [636, 673, 4, box_fill],
                             [851, 879, 5, box_fill],
                             [1566, 1651, 6, box_fill],
                             [2107, 2294, 7, box_fill]];

    for (var i in waveLengthsTop) {
        if(waveLengthsTop[i][2] == red_band){
            waveLengthsTop[i][3] = red_color;
        }else if(waveLengthsTop[i][2] == blue_band){
            waveLengthsTop[i][3] = blue_color;
        }else if(waveLengthsTop[i][2] == green_band){
            waveLengthsTop[i][3] = green_color;
        }
    }

    for (var j in waveLengthsBottom) {
        if(waveLengthsBottom[j][2] == red_band){
            waveLengthsBottom[j][3] = red_color;
        }else if(waveLengthsBottom[j][2] == blue_band){
            waveLengthsBottom[j][3] = blue_color;
        }else if(waveLengthsBottom[j][2] == green_band){
            waveLengthsBottom[j][3] = green_color;
        }
    }


    var svg = d3.selectAll(id)
        .append("svg")
        .attr("width", width)
        .attr("height", 2 * (height + stroke_width));

    svg.selectAll("rect")
        .data(waveLengthsTop, function(d){return d;})
        .enter()
        .append("rect")
        .attr("stroke-width", stroke_width)
        .attr("stroke", "#000")
        .attr("fill", function (d){ return (d[3]); })
        .attr("x", function (d){ return (width * ((d[0] - xLowNorm) / widthNorm)) + "px"; })
        .attr("y", 0 + "px")
        .attr("width", function (d){ return (width * (d[1] - d[0]) / (widthNorm - xLowNorm)) + "px"; })
        .attr("height", height + "px");

    svg.selectAll("rect")
        .data(waveLengthsBottom, function(d){return d;})
        .enter()
        .append("rect")
        .attr("stroke-width", stroke_width)
        .attr("stroke", "#000")
        .attr("fill", function (d){ return (d[3]); })
        .attr("x", function (d){ return (width * ((d[0] - xLowNorm) / widthNorm)) + "px"; })
        .attr("y", height + 2 * stroke_width + "px")
        .attr("width", function (d){ return (width * (d[1] - d[0]) / (widthNorm - xLowNorm)) + "px"; })
        .attr("height", height + "px");

    svg.selectAll("text")
        .data(waveLengthsTop, function(d){return d;})
        .enter()
        .append("text")
        .attr("x", function (d){ return (width * ((d[0] - xLowNorm) / widthNorm)) + "px"; })
        .attr("y", 0 + "px")
        .attr("text-anchor", "middle")
        .attr("dx", function (d){ return ((width * (d[1] - d[0]) / (widthNorm - xLowNorm)) / 2) + "px"; })
        .attr("dy", height / 2 + font_size / 2)
        .attr("font-size", font_size)
        .text(function(d) { return d[2]; });

    svg.selectAll("text")
        .data(waveLengthsBottom, function(d){return d;})
        .enter()
        .append("text")
        .attr("x", function (d){ return (width * ((d[0] - xLowNorm) / widthNorm)) + "px"; })
        .attr("y", height + 2 * stroke_width + "px")
        .attr("text-anchor", "middle")
        .attr("dx", function (d){ return ((width * (d[1] - d[0]) / (widthNorm - xLowNorm)) / 2) + "px"; })
        .attr("dy", height / 2 + font_size / 2)
        .attr("font-size", font_size)
        .text(function(d) { return d[2]; });
}

$(document).ready(function(){
    $(".preview").each(function(){
        graphId = $(this).find($(".graph")).attr("id");
        graph(graphId);
        });
});
