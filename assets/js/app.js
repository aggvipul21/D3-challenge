// @TODO: YOUR CODE HERE!
// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 100, left: 80 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//Create chartgroup where the graph would be plotted
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

//function to build xscale

function xaxisScale(data,chosenXAxis){
    var xscale=d3.scaleLinear()
                .domain([d3.min(data,d=> d[chosenXAxis]*0.8),d3.max(data,d=>d[chosenXAxis]*1.2)])
                .range([0,width]);
    return xscale;

}

//function to build ysacle

function yaxisScale(data,chosenYAxis){
    var yscale=d3.scaleLinear()
                .domain([d3.min(data,d=> d[chosenYAxis]*0.8),d3.max(data,d=>d[chosenYAxis]*1.2)])
                .range([height,0]);
    return yscale;
}

//function to render xaxis

function renderxaxis(newXScale,xAxis){
    var bottomaxis=d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomaxis);
    return xAxis;
}

//function to render yaxis
function renderyaxis(newYScale,yAxis){
    var leftaxis=d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftaxis);
    return yAxis;
}

//function to render circles
function rendercircle(circlesGroup,newXScale,newYScale,chosenXAxis,chosenYAxis){
    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));    
    return circlesGroup;    
}

//function to render circle text
function rendercircletext(circlesabbrev,newXScale,newYScale,chosenXAxis,chosenYAxis){
    circlesabbrev.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));
    return circlesabbrev;    
}

//function to update tooltip
function updateToolTip(circlesGroup,chosenXAxis,chosenYAxis){

    var xtip,ytip;
    //Find the x-label for tooltip
    if (chosenXAxis==="poverty"){xtip="Poverty"}
    else if (chosenXAxis==="age"){xtip="Age"}
    else {xtip="Income"};

    //Find the y-label for tooltip
    if (chosenYAxis==="obese"){ytip="Obese"}
    else if (chosenYAxis==="smokes"){ytip="Smoke"}
    else {ytip="Healthcare"};

    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([40, -40])
    // .attr('class', 'd3-tip')
    .html(function(d) {
      return (`${d.state}<br>${xtip}: ${d[chosenXAxis]}<br>${ytip}: ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Import data from an external CSV file
d3.csv("assets/data/data.csv").then(censusdata=> {
  console.log(censusdata);
 
  // Format the data
  censusdata.forEach(data=> {
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.poverty= +data.poverty;
    data.smokes= +data.smokes;
  });

  // Create scaling functions
  var xLinearScale = xaxisScale(censusdata,chosenXAxis);

  var yLinearScale = yaxisScale(censusdata,chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Add x-axis to the bottom of the graph
  var xAxis=chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y-axis to the left side of the display
  var yAxis=chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", "translate(0, 0)")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "10")
    .attr("class", "stateCircle")
    .attr("stroke-width", "1")

// append initial circle abbreviation
var circlesabbrev=chartGroup.selectAll("abbreviation")
    .data(censusdata)
    .enter()
    .append("text")
    .attr("x", d=>xLinearScale(d[chosenXAxis]))
    .attr("y", d=>yLinearScale(d[chosenYAxis]))
    .text(d=> d.abbr)
    .attr("class","stateText")
    .attr("font-size","10px");
   
//add tooltip for initial load

circlesGroup = updateToolTip(circlesGroup,chosenXAxis,chosenYAxis);

//Create labels group for x axis

var xlabelsgroup= chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + margin.top})`)
.classed("xText", true)

//Add label for poverty and default to active
var PovertyLabel = xlabelsgroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active xLabel", true)
    // .attr("class","xLabel")
    .text("In Poverty (%)");

//Add label for age and default to inactive
var AgeLabel = xlabelsgroup.append("text")
    .attr("x", 0)
    .attr("y",40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive xLabel", true)
    .text("Age (median)");

//Add label for Household income and default to inactive
var HouseholdIncomeLabel = xlabelsgroup.append("text")
.attr("x", 0)
.attr("y", 60)
.attr("value", "income") // value to grab for event listener
.classed("inactive xLabel", true)
.text("Household Income (median)");

//Create labels group for y axis

var ylabelsgroup= chartGroup.append("g")
.attr("transform", "rotate(-90)")
// , `translate(0, ${(0 - (height / 2))})`)
// .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
.classed("yText", true)

//Add label for Obese and default to inactive
var ObeseLabel = ylabelsgroup.append("text")
    //.attr("dy", 0 - margin.left)
    .attr("dx", 0 - (height / 2))
    .attr("dy", "-1.5em")
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive yLabel", true)
    .text("Obese (%)");

//Add label for Smokes and default to inactive
var SmokesLabel = ylabelsgroup.append("text")
    .attr("dx", 0 - (height / 2))
    .attr("dy", "-2.5em")
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive yLabel", true)
    .text("Smokes (%)");

//Add label for Healthcare and default to inactive
var HealthcareLabel = ylabelsgroup.append("text")
    .attr("dx", 0 - (height / 2))
    .attr("dy", "-3.5em")
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active yLabel", true)
    .text("Lacks healthcare (%)");

// x axis labels event listener

d3.selectAll(".xLabel")
    .on("click",function(){

        var value = d3.select(this).attr("value");
        console.log(value);

        if (value!=chosenXAxis){

            chosenXAxis=value;
            //Update x-scale based on new value
            xLinearScale = xaxisScale(censusdata,chosenXAxis);
            //Update x-axis based on new value
            xAxis=renderxaxis(xLinearScale,xAxis)
            //Update circles based on new value
            circlesGroup=rendercircle(circlesGroup,xLinearScale,yLinearScale,chosenXAxis,chosenYAxis)
            //Update circle abbrev based on new value
            circlesabbrev=rendercircletext(circlesabbrev,xLinearScale,yLinearScale,chosenXAxis,chosenYAxis)
            //Update tooltip based on new value
            circlesGroup = updateToolTip(circlesGroup,chosenXAxis,chosenYAxis);
            //Activate the axis selected by user and inactivate all other axis
            if (chosenXAxis === "poverty") {
                PovertyLabel
                  .classed("active", true)
                  .classed("inactive", false);
                AgeLabel
                  .classed("active", false)
                  .classed("inactive", true);
                HouseholdIncomeLabel
                  .classed("active", false)
                  .classed("inactive", true);
              }
            else if (chosenXAxis === "age") {
                AgeLabel
                  .classed("active", true)
                  .classed("inactive", false);
                PovertyLabel
                  .classed("active", false)
                  .classed("inactive", true);
                HouseholdIncomeLabel
                  .classed("active", false)
                  .classed("inactive", true);
              }
            else {
                HouseholdIncomeLabel
                  .classed("active", true)
                  .classed("inactive", false);
                PovertyLabel
                  .classed("active", false)
                  .classed("inactive", true);
                  AgeLabel
                  .classed("active", false)
                  .classed("inactive", true);
              }

        }

    });

    // y axis labels event listener

    d3.selectAll(".yLabel")
    .on("click",function(){

        var value = d3.select(this).attr("value");
        console.log(value);

        if (value!=chosenYAxis){

            chosenYAxis=value;
            //Update y-scale based on new value
            yLinearScale = yaxisScale(censusdata,chosenYAxis);
            //Update y-axis based on new value
            yAxis=renderyaxis(yLinearScale,yAxis)
            //Update circles based on new value
            circlesGroup=rendercircle(circlesGroup,xLinearScale,yLinearScale,chosenXAxis,chosenYAxis)
            //Update circle abbrev based on new value
            circlesabbrev=rendercircletext(circlesabbrev,xLinearScale,yLinearScale,chosenXAxis,chosenYAxis)
            //Update tooltip based on new value
            circlesGroup = updateToolTip(circlesGroup,chosenXAxis,chosenYAxis);
            //Activate the axis selected by user and inactivate all other axis
            if (chosenYAxis === "obesity") {
                ObeseLabel
                    .classed("active", true)
                    .classed("inactive", false);
                SmokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                HealthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === "smokes") {
                SmokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ObeseLabel
                    .classed("active", false)
                    .classed("inactive", true);
                HealthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                HealthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ObeseLabel
                    .classed("active", false)
                    .classed("inactive", true);
                SmokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }

        }

    });

}).catch(function(error) {
  console.log(error);
});




