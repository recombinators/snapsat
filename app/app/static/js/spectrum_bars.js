function graph() {
    // var colore = d3.scale.ordinal()
    //     .domain(d3.extent(dataset, function (d) { return d.Peso; }))
    //     .range(["#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]);

    var w = 100,
        h = 20,
        p = [30, 20, 40, 0],
        x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]),
        y = d3.scale.linear().range([0, h - p[0] - p[2]]),
        z = d3.scale.ordinal().range(["#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c"]),
        yx = d3.scale.linear().range([0, h - p[0] - p[2]]),
        format = d3.time.format("%b %Y");

    var svg = d3.select(".graph").append("svg:svg")
        .attr("width", w * 5)
        .attr("height", h)
        .append("svg:g");
        // .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

    svg.selectAll("rect")
      .data(z).enter()
      .append("rect")
      .attr("fill", function (color){ return color; })
      .attr("x", function (color, index){ return (index * 12) + "px"; })
      .attr("y", 0 + "px")
      .attr("width", w + "px")
      .attr("height", h + "px");

}

$(document).ready(function(){
    graph();
});
