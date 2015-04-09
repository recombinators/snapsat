function graph() {
    // var colore = d3.scale.ordinal()
    //     .domain(d3.extent(dataset, function (d) { return d.Peso; }))
    //     .range(["#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]);

    var xLowNorm = 400;
    var widthNorm = 2294;
    var waveLengthsTop = [[503, 676, 8], [1362, 1384, 9]];
    var waveLengthsBottom = [[435, 451, 1], [452, 512, 2], [533, 590, 3], [636, 673, 4], [851, 879, 5], [1566, 1651, 6], [2107, 2294, 7]];

    var width = $(".graph").parent().width();
    var height = 20;
    var stroke_width = 1;
    var box_fill = "#FFF";
    var stroke_color = "#000";
    var font_size = 8;

    var svg = d3.selectAll(".graph")
        .append("svg")
        .attr("width", width)
        .attr("height", 2 * (height + stroke_width));

    svg.selectAll("rect")
        .data(waveLengthsTop, function(d){return d;})
        .enter()
        .append("rect")
        .attr("stroke-width", stroke_width)
        .attr("stroke", "#000")
        .attr("fill", "#FFF")
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
        .attr("fill", "#FFF")
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
    graph();
});
