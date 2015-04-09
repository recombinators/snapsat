function graph() {
    // var colore = d3.scale.ordinal()
    //     .domain(d3.extent(dataset, function (d) { return d.Peso; }))
    //     .range(["#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]);

    var xLowNorm = 435;
    var widthNorm = 2294;

    var waveLengths = [[435, 451, 1], [452, 512, 2], [533, 590, 3], [636, 673, 4], [851, 879, 5], [1566, 1651, 6], [2107, 2294, 7], [503, 676, 8], [1362, 1384, 9]];

    var width = $(".graph").parent().width();
    var height = 20;
    var sw = 1,
        z = d3.scale.ordinal().range(["#FFF","#FFF","#FFF","#FFF","#FFF"]);

    var svg = d3.select(".graph").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g");
        // .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

    svg.selectAll("rect")
      .data(waveLengths).enter()
      .append("rect")
      .attr("stroke-width", sw)
      .attr("stroke", "#000")
      .attr("fill", "#FFF")
      .attr("x", function (color, index){ return (width * ((waveLengths[index][0] - xLowNorm) / widthNorm)) + "px"; })
      .attr("y", 0 + "px")
      .attr("width", function (color, index){ return (width * (waveLengths[index][1] - waveLengths[index][0]) / (widthNorm - xLowNorm)) + "px"; })
      .attr("height", height + "px");

}

$(document).ready(function(){
    graph();
});
