var height = 20;
var stroke_width = 1;
var box_fill = "#000";
var stroke_color = "#000";

var font_size = 8;
var red_color = "#c02137";
var green_color = "#4e9c62";
var blue_color = "#00668e";
var freqOffset = 0.035;

function refernceGraph(type){
    var width = $(".js-container-" + type).width();

    if(type == "full"){
        freqMin = 0.435;
        freqMax = 2.294;
        xLowNorm = freqMin - freqOffset;
        widthNorm = freqMax + freqOffset;

        waveLengths = [[0.435, 0.451, 1, "#6ca4d3", "Coastal/Aerosol"],
                       [0.452, 0.512, 2, blue_color, "Blue"],
                       [0.533, 0.590, 3, green_color, "Green"],
                       [0.636, 0.673, 4, red_color, "Red"],
                       [0.851, 0.879, 5, "#c5a3be", "Near Infrared (NIR)"],
                       [1.566, 1.651, 6, "#d49979", "SWIR 1"],
                       [2.107, 2.294, 7, "#999b98", "SWIR 2"],
                       [1.362, 1.384, 9, "#7f87b5", "Cirrus"]];
    }else{
        freqMin = 0.435;
        freqMax = 0.673;
        xLowNorm = freqMin - freqOffset;
        widthNorm = freqMax + freqOffset;

        waveLengths = [[0.452, 0.512, 2, blue_color, "Blue"],
                       [0.533, 0.590, 3, green_color, "Green"],
                       [0.636, 0.673, 4, red_color, "Red"]];
    }

    var svgBar = d3.selectAll("#js-reference-" + type)
            .append("svg")
            .attr("width", width)
            .attr("height", height + stroke_width)
            .attr('class', 'spectrumMap');

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([height * 2 , 0])
        .html(function(d) {
            return '<div class="sans">' + d[2] + ': ' + d[4] + ' (' + d[0] + " - " + d[1] + ' µm)' + '</div>';
            });

    svgBar.call(tip);

    svgBar.append("rect")
        .attr("x", 0 + "px")
        .attr("y", 0 + "px")
        .attr("width", width)
        .attr("height", height + stroke_width);

    svgBar.selectAll("rect")
        .data(waveLengths, function(d){return d;})
        .enter()
        .append("rect")
        .attr("stroke-width", stroke_width)
        .attr("stroke", stroke_color)
        .attr("fill", function (d){ return (d[3]); })
        .attr("x", function (d){ return ((d[0] - xLowNorm) * width / (widthNorm - xLowNorm)) + "px"; })
        .attr("y", 0 + "px")
        .attr("width", function (d){ return (width * (d[1] - d[0]) / (widthNorm - xLowNorm)) + "px"; })
        .attr("height", height + "px")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    svgBar.selectAll("text")
        .data(waveLengths, function(d){return d;})
        .enter()
        .append("text")
        .attr("x", function (d){ return (width * ((d[0] - xLowNorm) / widthNorm)) + "px"; })
        .attr("y", 0 + "px")
        .attr("text-anchor", "middle")
        .attr("dx", function (d){ return ((width * (d[1] - d[0]) / (widthNorm - xLowNorm)) / 2) + "px"; })
        .attr("dy", height / 2 + font_size / 2)
        .attr("font-size", font_size)
        .text(function(d) { return d[2]; })
        .attr("pointer-events", "none");
}

function graph(graphId, type) {
    var id = '#'.concat(graphId);
    var red_band = Number($(id).parent().find($(".band-red")).html());
    var green_band = Number($(id).parent().find($(".band-green")).html());
    var blue_band = Number($(id).parent().find($(".band-blue")).html());

    var width = $(id).parent().width();

    var waveLengths = [[red_band, red_color],
                       [blue_band, blue_color],
                       [green_band, green_color]];

    var svgBar = d3.selectAll(id)
            .append("svg")
            .attr("width", width)
            .attr("height", height + stroke_width)
            .attr('class', 'spectrumMap');

    svgBar.append("rect")
        .attr("x", 0 + "px")
        .attr("y", 0 + "px")
        .attr("width", width)
        .attr("height", height + stroke_width);

    svgBar.selectAll("rect")
        .data(waveLengths, function(d){return d;})
        .enter()
        .append("rect")
        .attr("stroke-width", stroke_width)
        .attr("stroke", stroke_color)
        .attr("fill", function (d){ return (d[1]); })
        .attr("x", function (d){ return ((width / 11) * (d[0] - 1)) + "px"; })
        .attr("y", 0 + "px")
        .attr("width", function (d){ return (width / 11)+ "px"; })
        .attr("height", height + "px")
        .attr("pointer-events", "none");
}



$(document).ready(function(){
    $(".preview").each(function(){
        graphId = $(this).find($(".js-graph")).attr("id");
        graph(graphId, "preview");
        });

    refernceGraph("full");
    refernceGraph("visible");

});

$(window).on('resize', function (){ 
    $(".js-graph").contents().remove();

    $(".preview").each(function(){
        graphId = $(this).find($(".js-graph")).attr("id");
        graph(graphId, "preview");
        });

    refernceGraph("full");
    refernceGraph("visible");
});
