function graph(graphId, type) {

    var id = '#'.concat(graphId);

    var parentId = $(id).parent().attr('id');
    var height = 20;
    var stroke_width = 1;
    var box_fill = "#FFF";
    var stroke_color = "#000";

    var font_size = 8;
    var red_band = Number($(id).parent().find($(".band-red")).html());
    var green_band = Number($(id).parent().find($(".band-green")).html());
    var blue_band = Number($(id).parent().find($(".band-blue")).html());
    var red_color = "#c02137";
    var green_color = "#4e9c62";
    var blue_color = "#00668e";

    var xLowNorm = 400;
    var widthNorm = 2294;

    if(type == "reference"){
        width = $(".preview-container").width();

        waveLengthsTop = [[503, 676, 8, "#008ea2"],
                          [1362, 1384, 9, "#7f87b5"]];
        waveLengthsBottom = [[435, 451, 1, "#6ca4d3"],
                             [452, 512, 2, blue_color],
                             [533, 590, 3, green_color],
                             [636, 673, 4, red_color],
                             [851, 879, 5, "#c5a3be"],
                             [1566, 1651, 6, "#d49979"],
                             [2107, 2294, 7, "#999b98"]];
    }else if(type == "preview"){
        width = $(id).parent().width();

        waveLengthsTop = [[503, 676, 8, box_fill],
                          [1362, 1384, 9, box_fill]];
        waveLengthsBottom = [[435, 451, 1, box_fill],
                             [452, 512, 2, box_fill],
                             [533, 590, 3, box_fill],
                             [636, 673, 4, box_fill],
                             [851, 879, 5, box_fill],
                             [1566, 1651, 6, box_fill],
                             [2107, 2294, 7, box_fill]];

        for (var i in waveLengthsTop){
            if(waveLengthsTop[i][2] == red_band){
                waveLengthsTop[i][3] = red_color;
            }else if(waveLengthsTop[i][2] == blue_band){
                waveLengthsTop[i][3] = blue_color;
            }else if(waveLengthsTop[i][2] == green_band){
                waveLengthsTop[i][3] = green_color;
            }
        }

        for (var j in waveLengthsBottom){
            if(waveLengthsBottom[j][2] == red_band){
                waveLengthsBottom[j][3] = red_color;
            }else if(waveLengthsBottom[j][2] == blue_band){
                waveLengthsBottom[j][3] = blue_color;
            }else if(waveLengthsBottom[j][2] == green_band){
                waveLengthsBottom[j][3] = green_color;
            }
        }
    }

    


    var svgBar = d3.selectAll(id)
        .append("svg")
        .attr("width", width)
        .attr("height", 2 * (height + stroke_width))
        .attr('class', 'spectrumMap');

    svgBar.append("rect")
        .attr("x", 0 + "px")
        .attr("y", 0 + "px")
        .attr("width", width)
        .attr("height", 2 * (height + stroke_width));

    svgBar.selectAll("rect")
        .data(waveLengthsTop, function(d){return d;})
        .enter()
        .append("rect")
        .attr("stroke-width", stroke_width)
        .attr("stroke", stroke_color)
        .attr("fill", function (d){ return (d[3]); })
        .attr("x", function (d){ return (width * ((d[0] - xLowNorm) / widthNorm)) + "px"; })
        .attr("y", 0 + "px")
        .attr("width", function (d){ return (width * (d[1] - d[0]) / (widthNorm - xLowNorm)) + "px"; })
        .attr("height", height + "px");

    svgBar.selectAll("rect")
        .data(waveLengthsBottom, function(d){return d;})
        .enter()
        .append("rect")
        .attr("stroke-width", stroke_width)
        .attr("stroke", stroke_color)
        .attr("fill", function (d){ return (d[3]); })
        .attr("x", function (d){ return (width * ((d[0] - xLowNorm) / widthNorm)) + "px"; })
        .attr("y", height + 2 * stroke_width + "px")
        .attr("width", function (d){ return (width * (d[1] - d[0]) / (widthNorm - xLowNorm)) + "px"; })
        .attr("height", height + "px");

    if(type == "reference"){
        svgBar.selectAll("text")
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

        svgBar.selectAll("text")
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
}

$(document).ready(function(){
    $(".preview").each(function(){
        graphId = $(this).find($(".graph")).attr("id");
        graph(graphId, "preview");
        });

    $("#reference").each(function(){
        graphId = $(this).attr("id");
        graph(graphId, "reference");
        });
});

$(window).on('resize', function (){ 
    $(".graph").contents().remove();

    $(".preview").each(function(){
        graphId = $(this).find($(".graph")).attr("id");
        graph(graphId, "preview");
        });

    $("#reference").each(function(){
        graphId = $(this).attr("id");
        graph(graphId, "reference");
        });
});
