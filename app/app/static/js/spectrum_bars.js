
function graph() {
  var colore = d3.scale.ordinal()
      .domain(d3.extent(dataset, function (d) { return d.Peso; }))
      .range(["#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]);

  svg.selectAll("rect")
      .data(colore.range()).enter()
      .append("rect")
      .attr("fill", function (color){ return color; })
      .attr("x", function (color, index){ return (index * 12) + "px"; })
      .attr("y", margin - 8 + "px")
      .attr("width", 8 + "px")
      .attr("height", 8 + "px");
}

window.onload = graph();
