function graph(graphId, type) {

    var id = '#'.concat(graphId);

    var height = 20;
    var stroke_width = 1;
    var box_fill = "#000";
    var stroke_color = "#000";

    var font_size = 8;
    var red_band = Number($(id).parent().find($(".band-red")).html());
    var green_band = Number($(id).parent().find($(".band-green")).html());
    var blue_band = Number($(id).parent().find($(".band-blue")).html());
    var red_color = "#c02137";
    var green_color = "#4e9c62";
    var blue_color = "#00668e";

    var xLowNorm = 0.400;
    var widthNorm = 2.294;

    var bandLegend = {};
    bandLegend["1"] = "Band 1: Coastal aerosol";
    bandLegend["2"] = "Band 2: Blue";
    bandLegend["3"] = "Band 3: Green";
    bandLegend["4"] = "Band 4: Red";
    bandLegend["5"] = "Band 5: Near Infrared (NIR)";
    bandLegend["6"] = "Band 6: SWIR 1";
    bandLegend["7"] = "Band 7: SWIR 2";
    bandLegend["9"] = "Band 9: Cirrus";

    var freqLegend = {};
    freqLegend["1"] = "1: Coastal/Aerosol (0.435 - 0.451 µm)";
    freqLegend["2"] = "2: Blue (0.452 - 0.512 µm)";
    freqLegend["3"] = "3: Green (0.533 - 0.590 µm)";
    freqLegend["4"] = "4: Red (0.636 - 0.673 µm)";
    freqLegend["5"] = "5: Near Infrared (NIR) (0.851 - 0.879 µm)";
    freqLegend["6"] = "6: SWIR 1 (1.566 - 1.651 µm)";
    freqLegend["7"] = "7: SWIR 2 (2.107 - 2.294 µm)";
    freqLegend["9"] = "9: Cirrus (1.363 - 1.384 µm)";

    if(type == "reference"){
        width = $(".d3-container").width();

        waveLengths = [[0.435, 0.451, 1, "#6ca4d3"],
                       [0.452, 0.512, 2, blue_color],
                       [0.533, 0.590, 3, green_color],
                       [0.636, 0.673, 4, red_color],
                       [0.851, 0.879, 5, "#c5a3be"],
                       [1.566, 1.651, 6, "#d49979"],
                       [2.107, 2.294, 7, "#999b98"],
                       [1.362, 1.384, 9, "#7f87b5"]];

        svgBar = d3.selectAll(id)
            .append("svg")
            .attr("width", width)
            .attr("height", height + stroke_width)
            .attr('class', 'spectrumMap');

        tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([height *2 , 0])
        .html(function(d) {
            return '<div class="sans">' + freqLegend[d[2]] + '</div>';
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
            .attr("x", function (d){ return (width * ((d[0] - xLowNorm) / widthNorm)) + "px"; })
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

    }else if(type == "preview"){
        width = $(id).parent().width();

        waveLengths = [[0.435, 0.451, 1, box_fill],
                       [0.452, 0.512, 2, box_fill],
                       [0.533, 0.590, 3, box_fill],
                       [0.636, 0.673, 4, box_fill],
                       [0.851, 0.879, 5, box_fill],
                       [1.566, 1.651, 6, box_fill],
                       [2.107, 2.294, 7, box_fill],
                       [0.503, 0.676, 8, box_fill],
                       [1.362, 1.384, 9, box_fill],
                       [10.60, 12.51, 10, box_fill],
                       [11.50, 12.51, 11, box_fill]];

        for (var j in waveLengths){
            if(waveLengths[j][2] == red_band){
                waveLengths[j][3] = red_color;
            }else if(waveLengths[j][2] == blue_band){
                waveLengths[j][3] = blue_color;
            }else if(waveLengths[j][2] == green_band){
                waveLengths[j][3] = green_color;
            }
        }

        svgBar = d3.selectAll(id)
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
            .attr("fill", function (d){ return (d[3]); })
            .attr("x", function (d){ return ((width / waveLengths.length) * (d[2] - 1)) + "px"; })
            .attr("y", 0 + "px")
            .attr("width", function (d){ return (width / waveLengths.length)+ "px"; })
            .attr("height", height + "px")
            .attr("pointer-events", "none");
        
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
