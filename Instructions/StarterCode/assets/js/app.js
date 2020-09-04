 // @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;
// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 120,
    left: 120
  };

  // Define dimensions of the chart area
  var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
  var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

  var chart = d3.select("#scatter")
    // .append("div")
    // .attr("width", svgWidth)
    // .classed("chart",true);

   var svg = chart.append("svg") 
  .attr("height", svgHeight)
  .attr("width", svgWidth);
  // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 1)

// Load data from data.csv
d3.csv("https://raw.githubusercontent.com/DSB011/D3-Challenge/master/Instructions/StarterCode/assets/data/data.csv").then(function(healthData){
        //console.log(healthData);
   
// d3.csv("assets/data/data.csv", function(error, healthData){
//     if (error) throw error;

// Parse Data
 healthData.forEach(function(data){
     data.poverty = +data.poverty;
     data.healthcare = +data.healthcare;
  //data.abbr = +data.abbr;
     console.log(data);
 });

 // Create scales for the chart
    var x = d3.scaleLinear().range([0, chartWidth]);
    var y = d3.scaleLinear().range([chartHeight,0]);
    var bottomAxis = d3.axisBottom(x);
    var leftAxis = d3.axisLeft(y);

 // Scaling the data    
    x.domain([0,d3.max(healthData, function(data){
        return +data.poverty;
    })]);
    y.domain([0,d3.max(healthData, function(data){
        return +data.healthcare;
        
    })]);

 // Defining the Tooltip

     var toolTip = d3.tip()
            .attr("class", "toolTip")
            .offset([80, -60])
            .style("background", "lightyellow")
            .html(function(d){
             // console.log(d);
             var state = d.state;  
             
             var povertyrate = +d.poverty;
              //  console.log(povertyrate);
              var healthcarerate = +d.healthcare;
              return(`State :${state} <br> Poverty Rate (%):${povertyrate}<br> Health Rate (%):${healthcarerate}`);
            });
    chartGroup.call(toolTip);
    

// Defining circles on the chart
        chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", function(data, index){
                console.log(data.poverty);
                return x(data.poverty);
            })
            .attr("cy", function(data, index){
                console.log(data.healthcare);
                return y(data.healthcare);
            })
            .attr("r", "10")
            .attr("fill", "blue")
            .style("opacity", 0.5)
            .on("click", function(data){
                toolTip.show(data);
            });

        // Add x-axis
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
        
        // Add y-axis
            chartGroup.append("g")
                .call(leftAxis);
        
        var yLabels = chartGroup.append("g")
            .attr("transform", `translate(${0-chartMargin.left/2}, ${chartHeight/2})`)


        // text for y-axis

            yLabels.append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("class", "axisText")
                .text("Population in Fair or Poor Health (%)")
                .attr("transform", "rotate(-90)")
             // text for x-axis
             chartGroup.append("text")
                  .attr("transform", `translate( ${chartWidth/2}, ${chartHeight  + 30})`)
                  .attr("class", "axisText")
                  .style("text-anchor", "middle")
                  .text("Population Below the poverty line (%)");

            // Text for title
            chartGroup.append("text")
                .attr("transform", `translate(${chartWidth / 2}, 0)`)
                .style("text-anchor", "center")
                .attr("class", "axisText")
                .text("Health vs Poverty")


        })
 
