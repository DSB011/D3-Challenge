
var width = parseInt(d3.select('#scatter')
.style("width"));

var height = width * 2/3;
var margin = 10;
var label = 110;
var padding = 45;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

var bottomTextX = (width-label)/2 + label;
var bottomTextY = height - margin - padding;
xText.attr("transform", `translate(
    ${bottomTextX},
    ${bottomTextY})`
    );

xText.append("text")
    .attr("y", -19)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("calss", "aText active x")
    .text("In Poverty (%)");

xText.append("text")
    .attr("y", 0)
    .attr("data-name", "age")
    .attr("data-axis", "x")
    .attr("calss", "aText inactive x")
    .text("Age (Median)");

xText.append("text")
    .attr("y", 19)
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("calss", "aText inactive x")
    .text("Income (Median)");

svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");

var leftTextX = margin + padding;
var leftTextY = (height + label)/2 - label;
yText.attr("transform", `translate(
    ${leftTextX},
    ${leftTextY}
    ) rotate(-90)`
    );

yText.append("text")
    .attr("y", -22)
    .attr("data-name", "obesity")
    .attr("data-axis", "y")
    .attr("calss", "aText active y")
    .text("Obese (%)");

yText.append("text")
    .attr("y", 0)
    .attr("data-name", "smokes")
    .attr("data-axis", "y")
    .attr("calss", "aText inactive y")
    .text("Smokes (%)");

yText.append("text")
    .attr("y", 22)
    .attr("data-name", "Healthcare")
    .attr("data-axis", "y")
    .attr("calss", "aText inactive y")
    .text("Lacks Healthcare(%)");

// Visualize Data
// Circle

var radius;
function adjustRadius() {
    if (width <=530) {
        radius = 7;}
    else {
        radius = 10;}
    
}
adjustRadius();

// Loading CSV and Read in data as a Promise
d3.csv("../assets/data/data.csv").then(function(data){
    visualize(data);
});

function visualize (csvdata) {
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    var defaultX = "poverty";
    var defaultY = "obesity";

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([40,-60])
        .html(function(d) {
            var stateL = `<div>${d.state}</div>`;
            var yLine = `<div>${defaultY}: ${d[defaultY]}%</div>`;
            if (defaultX === "poverty") {
                xLine = `<div>${defaultX}: ${d[defaultX]}%</div>`
            }
            else {
                xLine = `<div>${defaultX}: ${parseFloat(d[defaultX]).toLocaleString("en")}</div>`;
            }
            return stateL + xLine + yLine
        });

    // Add toolTip to svg
    svg.call(toolTip);

    function labelUpdate(axis, clickText) {
        d3.selectAll(".aText")
            .filter("." + axis)
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);
        clickText.classed("inactive", false).classed("active", true);
    }

    function xMinMax() {
        xMin = d3.min(csvdata, function(d){
            return parseFloat(d[defaultX]) * 0.85;
        });
        xMax = d3.max(csvdata,function(d) {
            return parseFloat(d[defaultX]) * 1.15;
        });

    }
    function yMinMax(){
        yMin = d3.min(csvdata, function(d){
            return parseFloat(d[defaultY]) * 0.85;
        });
        yMax = d3.max(csvdata, function(d){
            return parseFloat(d[defaultY]) * 1.15;
        });
    }

// Scatter Plot X & Y axis
xMinMax();
yMinMax();

var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + label, width - margin])

var yscale = d3 
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - label, margin])

// Create Scaled X & Y axis
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yscale);

function tickscount() {
    if(width <= 530){
        xAxis.ticks(5);
        yAxis.ticks(5)
    }
    else {
        xAxis.ticks(10);
        yAxis.ticks(10);
    }
}
tickscount();

svg.append("g")
    .call(xAxis)
    .attr("class","xAxis")
    .attr("transform", `translate(
        0, ${height - margin - label})`
    );

svg.append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", `translate(
        0, ${margin + label}, 0)`
    );

// Appending circles 
var appCircels = svg.selectAll("g appCircles").data(csvdata).enter();

appCircels.append("circle")
        .attr("cx", function(d){
            return xScale(d[defaultX]);
        })
        .attr("cy", function(d){
            return yscale(d[defaultY]);
        })
        .attr("r", radius)
        ,attr("class", function(d){
            return "stateCircle " + d.abbr;
        })
        .on("mouseover", function(d){
            toolTip.show(d,this);
            d3.select(this).style("stroke", "#323232");
        })
        .on("mouseout", function(d){
            toolTip.hide(d);
            d3.select(this).style("stroke", "#e3e3e3")
        });

        appCircels
            .append("text")
            .attr("font-size", radius)
            .attr("class", "stateText")
            .attr("dx", function(d){
                return xScale(d[defaultX]);
            })
            .attr("dy", function(d){
                return yscale(d[defaultY])+ radius /3;
            })
            .text(function(d){
                return d.abbr;
            })
            .on("mouseover", function(d){
                toolTip.show(d);
                d3.select("."+ d.abbr).style("stroke", "#323232");
            })
            .on("mouseout", function(d){
                toolTip.hide(d);
                d3.select("."+ d.abbr).style("stroke", "#e3e3e3")
            });
    // Bonus: Dynamic Graph
    d3.selectAll(".aText").on("click", function(){
        var sel = d3.sel(this)
        if (sel.classed("inactive")) {
            var axis = sel.attr("data-axis")
            var name = sel.attr("data-name")

            if(axis === "x") {
                defaultX = name;

                xMinMax();
                xScale.domain([xMin, xMax]);
                svg.select(".xAxis")
                    .transition().duration(800)
                    .call(xAxis);
                d3.selectAll("circle").each(function(){
                    d3.select(this)
                    .transition().duration(800)
                    .attr("cx", function(d){
                        return xScale(d[defaultX])
                    });
                });
                d3.selectAll(".stateText").each(function(){
                    d3.select(this)
                    .transition().duration(800)
                    .attr("dx", function(d){
                        return xScale(d[defaultX])
                    });
                });
                labelUpdate (axis, sel); 
            }
            else {
                defaultY = name;
                yMinMax();
                yScale.domain([yMin, yMax]);
                svg.select(".yAxis")
                    .transition().duration(800)
                    .call(yAxis);
                d3.selectAll("circle").each(function(){
                    d3.select(this)
                    .transition().duration(800)
                    .attr("cy", function(d){
                        return yScale(d[defaultY])
                    });
                });
                d3.selectAll(".stateText").each(function(){
                    d3.select(this)
                    .transition().duration(800)
                    .attr("dy", function(d){
                        return yScale(d[defaultY]) + radius/3;
                    });
                });
                labelUpdate(axis, sel);
            }
        }
    });
}



