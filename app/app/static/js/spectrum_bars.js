// Set constants for colors and sizes for box fills, box stroke, font, and bar height
var stroke_width = 1;
var box_fill = "#000";
var stroke_color = "#000";
var font_size = 8;

// RGB colors
var red_color = "#c02137";
var green_color = "#4e9c62";
var blue_color = "#00668e";

// Frequency offest for bar frequency to container width mapping
var freqOffset = 0.035;

// Funciton that generates both reference bar graphs. type = "full" or "visible"
function refernceGraph(type){
    // Get width from container
    var width = $(".js-container-" + type).width();

    // Set height of graph
    var height = 60;

    // Reference graph with full spectrum
    if(type == "full"){
        // Set minimum and maximum spectrum
        freqMin = 0.435;
        freqMax = 2.294;

        // Settings for mapping frequency range to wdith of container
        xLowNorm = freqMin - freqOffset;
        widthNorm = freqMax + freqOffset;

        // List of bands min/max frequency, colors, and names.
        waveLengths = [[0.435, 0.451, 1, "#6ca4d3", "30 m, Coastal/Aerosol"],
                       [0.452, 0.512, 2, blue_color, "30 m, Blue"],
                       [0.533, 0.590, 3, green_color, "30 m, Green"],
                       [0.636, 0.673, 4, red_color, "30 m, Red"],
                       [0.851, 0.879, 5, "#c5a3be", "30 m, Near Infrared (NIR)"],
                       [1.566, 1.651, 6, "#d49979", "30 m, SWIR 1"],
                       [2.107, 2.294, 7, "#999b98", "30 m, SWIR 2"],
                       [0.503, 0.676, 8, "#008ea2", "15 m, Pan"],
                       [1.362, 1.384, 9, "#7f87b5", "30 m, Cirrus"]];
    }else{
        // Set minimum and maximum spectrum
        freqMin = 0.435;
        freqMax = 0.673;

        // Settings for mapping frequency range to wdith of container

        xLowNorm = freqMin - freqOffset;
        widthNorm = freqMax + freqOffset;

        // List of bands min/max frequency, colors, and names.
        waveLengths = [[0.452, 0.512, 2, blue_color, "Blue"],
                       [0.533, 0.590, 3, green_color, "Green"],
                       [0.636, 0.673, 4, red_color, "Red"]];
    }

    // Base svg object for graph
    var svgBar = d3.selectAll("#js-reference-" + type)
            .append("svg")
            .attr("width", width)
            .attr("height", height + 2 * stroke_width)
            .attr('class', 'spectrumMap');

    // Tool tip for bar graph. Band #: Name (Min Frequency - Max Frequency µm) 
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset(function (d){if(d[2] == 1){ return ([1.33*height + font_size, 0]);}else if(d[2] == 9){ return ([1.33*height + font_size, 0]);}else if(d[2] == 8){ return ([2*height/3 + font_size, 0]);}else{ return ([height + font_size , 0]);}})
        .html(function(d) {
            return '<div class="sans">' + 'Band '+ d[2] + ': ' + d[4] + ' (' + d[0] + " - " + d[1] + ' µm)' + '</div>';
            });

    // Call tool tip
    svgBar.call(tip);

    // Append svg objects for bars for each band
    svgBar.append("rect")
        .attr("x", 0 + "px")
        .attr("y", 0 + "px")
        .attr("width", width)
        .attr("height", height + stroke_width);

    // Create bars for each band and add tool tip
    svgBar.selectAll("rect")
        .data(waveLengths, function(d){return d;})
        .enter()
        .append("rect")
        .attr("stroke-width", stroke_width)
        .attr("stroke", stroke_color)
        .attr("fill", function (d){ return (d[3]); })
        .attr("x", function (d){ return ((d[0] - xLowNorm) * width / (widthNorm - xLowNorm)) + "px"; })
        .attr("y", function (d){if(d[2] == 1){ return (0+ "px");}else if(d[2] == 9){ return (0+ "px");}else if(d[2] == 8){ return (2*height/3 + "px");}else{ return ( height/3 + "px");}})
        .attr("width", function (d){ return (width * (d[1] - d[0]) / (widthNorm - xLowNorm)) + "px"; })
        .attr("height", height / 3 + "px")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // Add band number as text to center of each bar. Make invisible to mouse events for tool tip
    svgBar.selectAll("text")
        .data(waveLengths, function(d){return d;})
        .enter()
        .append("text")
        .attr("x", function (d){ return ((d[0] - xLowNorm) * width / (widthNorm - xLowNorm)) + "px"; })
        .attr("y", 0 + "px")
        .attr("text-anchor", "middle")
        .attr("dx", function (d){ return ((width * (d[1] - d[0]) / (widthNorm - xLowNorm)) / 2) + "px"; })
        .attr("dy", function (d){if(d[2] == 1){ return (height/6 + font_size/2);}else if(d[2] == 9){ return (height/6 + font_size / 2);}else if(d[2] == 8){ return (5*height/6 + font_size/2);}else{return (height/2 + font_size / 2);}})
        .attr("font-size", font_size)
        .text(function(d) { return d[2]; })
        .attr("pointer-events", "none");
}

// Function to create bar code for each preview
function graph(graphId) {
    // Get id of each preview
    var id = '#'.concat(graphId);

    // Get bands mapped to RGB from parent id, which is the band combo (id='RGB')
    var red_band = Number($(id).parent().parent().attr('id')[0]);
    var green_band = Number($(id).parent().parent().attr('id')[1]);
    var blue_band = Number($(id).parent().parent().attr('id')[2]);

    // Get width from associated preview
    var width = $(id).parent().width();

    // Set height of code
    var height = 20;

    // List of wavelengths mapped to RGB
    var waveLengths = [[red_band, red_color],
                       [green_band, green_color],
                       [blue_band, blue_color]];

    // Base svg object for bar code
    var svgBar = d3.selectAll(id)
            .append("svg")
            .attr("width", width)
            .attr("height", height + stroke_width)
            .attr('class', 'spectrumMap');

    // Append svg objects for bars for each band
    svgBar.append("rect")
        .attr("x", 0 + "px")
        .attr("y", 0 + "px")
        .attr("width", width)
        .attr("height", height + stroke_width);

    // Create bars for each band
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

    // Add band number as text to center of each bar. Make invisible to mouse events for tool tip
    svgBar.selectAll("text")
        .data(waveLengths, function(d){return d;})
        .enter()
        .append("text")
        .attr("x", function (d){ return ((width / 11) * (d[0] - 1)) + "px"; })
        .attr("y", 0 + "px")
        .attr("text-anchor", "middle")
        .attr("dx", function (d){ return ((width / 11)/2 ) + "px"; })
        .attr("dy", height/2 + font_size/2 + "px")
        .attr("font-size", font_size)
        .text(function(d) { return d[0]; })
        .attr("pointer-events", "none");
}

// Create bar codes and graphs on DOM ready.
$(document).ready(function(){

    // Create bar code for each preview
    $(".js-preview").each(function(){
        graphId = $(this).find($(".js-graph")).attr("id");
        graph(graphId);
        });

    if($(this).find("#js-reference-full").length){
    // Create full reference bar graphs
        refernceGraph("full");
    }

    if($(this).find("#js-reference-visible").length){
    // Create visible reference bar graphs
        refernceGraph("visible");
    }
});

// Create bar codes and graphs on window resize to fix width of bar not inheriting properly
$(window).on('resize', function (){
    //  Remove bar codes and graphs
    $(".js-graph").contents().remove();
    
    if($(document).find(".js-preview").length){
        // Create bar code for each preview
        $(".js-preview").each(function(){
            graphId = $(this).find($(".js-graph")).attr("id");
            graph(graphId);
            });
    }

    if($(document).find("#js-reference-full").length){
    // Create full reference bar graphs
        refernceGraph("full");
    }

    if($(document).find("#js-reference-visible").length){
    // Create visible reference bar graphs
        refernceGraph("visible");
    }
});
